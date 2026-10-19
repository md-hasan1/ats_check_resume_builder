import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";
import { getBaseUrl, env } from "@/lib/env";

export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { priceId, plan } = await request.json();
    const resolvedPriceId =
      priceId ||
      (plan === "business"
        ? (env.stripeBusinessPriceId || process.env.STRIPE_BUSINESS_PRICE_ID || process.env.NEXT_PUBLIC_STRIPE_BUSINESS_PRICE_ID)
        : (env.stripeProPriceId || process.env.STRIPE_PRO_PRICE_ID || process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID));

    if (!resolvedPriceId) {
      return NextResponse.json(
        { error: "Stripe Price ID is not configured on the server. Please check your environment settings." },
        { status: 400 }
      );
    }

    // STEP 1: Check database for existing subscription record & customer ID
    let subscription = await db.subscription.findUnique({
      where: { userId: session.user.id },
    });

    let customerId = subscription?.stripeCustomerId || null;

    // STEP 2: If customerId exists in DB, verify active status with Stripe API
    if (customerId) {
      try {
        const existingCustomer = await stripe.customers.retrieve(customerId);
        if (existingCustomer.deleted) {
          customerId = null;
        }
      } catch (err) {
        console.warn("Stored Stripe customer ID invalid or not found on Stripe, resetting:", err);
        customerId = null;
      }
    }

    // STEP 3: If customerId is null/invalid, search Stripe by user email first
    if (!customerId && session.user.email) {
      try {
        const stripeCustomers = await stripe.customers.list({
          email: session.user.email,
          limit: 1,
        });

        if (stripeCustomers.data.length > 0) {
          customerId = stripeCustomers.data[0].id;
        }
      } catch (err) {
        console.warn("Failed to search Stripe customer by email:", err);
      }
    }

    // STEP 4: If still no customer found in Stripe, create a new Stripe customer
    if (!customerId) {
      try {
        const newCustomer = await stripe.customers.create({
          email: session.user.email,
          name: session.user.name,
          metadata: { userId: session.user.id },
        });
        customerId = newCustomer.id;
      } catch (err) {
        console.error("Failed to create new Stripe customer:", err);
      }
    }

    // STEP 5: Save/Update customerId in database
    if (customerId) {
      if (!subscription) {
        subscription = await db.subscription.create({
          data: {
            userId: session.user.id,
            stripeCustomerId: customerId,
          },
        });
      } else if (subscription.stripeCustomerId !== customerId) {
        await db.subscription.update({
          where: { userId: session.user.id },
          data: { stripeCustomerId: customerId },
        });
      }
    }

    // STEP 6: Create Stripe Checkout Session using customerId
    const appUrl = getBaseUrl();

    try {
      const checkoutSession = await stripe.checkout.sessions.create({
        customer: customerId || undefined,
        customer_email: customerId ? undefined : session.user.email,
        mode: "subscription",
        payment_method_types: ["card"],
        line_items: [{ price: resolvedPriceId, quantity: 1 }],
        success_url: `${appUrl}/billing?success=true`,
        cancel_url: `${appUrl}/billing?canceled=true`,
        metadata: { userId: session.user.id },
      });

      return NextResponse.json({ url: checkoutSession.url });
    } catch (stripeSessionErr) {
      console.error("Stripe checkout session creation failed:", stripeSessionErr);
      const errorMsg = stripeSessionErr instanceof Error ? stripeSessionErr.message : "Failed to create Stripe checkout session";
      return NextResponse.json(
        { error: errorMsg, isStripeError: true },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Checkout error:", error);
    const msg = error instanceof Error ? error.message : "Failed to create checkout session";
    return NextResponse.json(
      { error: msg },
      { status: 500 }
    );
  }
}

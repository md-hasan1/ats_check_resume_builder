import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { env } from "@/lib/env";

export async function GET() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get current subscription record from DB
    let subscription = await db.subscription.findUnique({
      where: { userId: session.user.id },
    });

    let stripeCustomerId = subscription?.stripeCustomerId || null;

    // Fallback: If customerId is not in DB, search Stripe by user email
    if (!stripeCustomerId && session.user.email) {
      try {
        const stripeCustomers = await stripe.customers.list({
          email: session.user.email,
          limit: 1,
        });
        if (stripeCustomers.data.length > 0) {
          stripeCustomerId = stripeCustomers.data[0].id;
        }
      } catch (err) {
        console.warn("Failed to search Stripe customer by email:", err);
      }
    }

    // Direct Stripe API Auto-Sync: Check if customer has active subscriptions in Stripe
    if (stripeCustomerId) {
      try {
        const stripeSubs = await stripe.subscriptions.list({
          customer: stripeCustomerId,
          status: "active",
          limit: 1,
        });

        if (stripeSubs.data.length > 0) {
          const activeSub = stripeSubs.data[0];
          const priceId = activeSub.items.data[0]?.price.id;
          const businessPriceId = env.stripeBusinessPriceId || process.env.STRIPE_BUSINESS_PRICE_ID;
          const plan =
            priceId && businessPriceId && priceId === businessPriceId
              ? "BUSINESS"
              : "PRO";

          const subObj = activeSub as unknown as { current_period_start?: number; current_period_end?: number };
          const periodStart = subObj.current_period_start ? new Date(subObj.current_period_start * 1000) : new Date();
          const periodEnd = subObj.current_period_end ? new Date(subObj.current_period_end * 1000) : new Date();

          subscription = await db.subscription.upsert({
            where: { userId: session.user.id },
            create: {
              userId: session.user.id,
              stripeCustomerId,
              stripeSubscriptionId: activeSub.id,
              stripePriceId: priceId,
              plan,
              status: "ACTIVE",
              currentPeriodStart: periodStart,
              currentPeriodEnd: periodEnd,
            },
            update: {
              stripeSubscriptionId: activeSub.id,
              stripePriceId: priceId,
              plan,
              status: "ACTIVE",
              cancelAtPeriodEnd: activeSub.cancel_at_period_end,
              currentPeriodStart: periodStart,
              currentPeriodEnd: periodEnd,
            },
          });
        }
      } catch (stripeSyncErr) {
        console.warn("Stripe auto-sync check failed:", stripeSyncErr);
      }
    }

    const rawPlan = (subscription?.plan || "FREE").toUpperCase();
    const status = (subscription?.status || "ACTIVE").toUpperCase();
    const isExpired = subscription?.currentPeriodEnd ? new Date(subscription.currentPeriodEnd).getTime() < Date.now() : false;
    const isActivePaid =
      (rawPlan === "PRO" || rawPlan === "BUSINESS") &&
      (status === "ACTIVE" || status === "TRIALING" || status === "PAID") &&
      !isExpired;

    const plan = isActivePaid ? rawPlan.toLowerCase() : (rawPlan === "PRO" || rawPlan === "BUSINESS") && status === "ACTIVE" ? rawPlan.toLowerCase() : "free";

    // Count usage in the current calendar month
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const checksCount = await db.usageLog.count({
      where: {
        userId: session.user.id,
        action: "resume_check",
        createdAt: { gte: startOfMonth },
      },
    });

    const checksLimit = plan === "free" ? 3 : null;

    return NextResponse.json({
      success: true,
      subscription: {
        plan,
        rawPlan,
        status,
        stripeCustomerId: subscription?.stripeCustomerId || null,
        stripeSubscriptionId: subscription?.stripeSubscriptionId || null,
        cancelAtPeriodEnd: subscription?.cancelAtPeriodEnd || false,
        currentPeriodStart: subscription?.currentPeriodStart || null,
        currentPeriodEnd: subscription?.currentPeriodEnd || null,
        checksCount,
        checksLimit,
      },
    });
  } catch (error) {
    console.error("Fetch subscription error:", error);
    return NextResponse.json(
      { error: "Failed to fetch subscription details" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { plan } = await request.json();
    const targetPlan = (plan || "PRO").toUpperCase();

    if (!["FREE", "PRO", "BUSINESS"].includes(targetPlan)) {
      return NextResponse.json({ error: "Invalid plan specified" }, { status: 400 });
    }

    const now = new Date();
    const nextYear = new Date(now.getFullYear() + 1, now.getMonth(), now.getDate());

    const updated = await db.subscription.upsert({
      where: { userId: session.user.id },
      create: {
        userId: session.user.id,
        plan: targetPlan as "FREE" | "PRO" | "BUSINESS",
        status: "ACTIVE",
        currentPeriodStart: now,
        currentPeriodEnd: targetPlan === "FREE" ? null : nextYear,
      },
      update: {
        plan: targetPlan as "FREE" | "PRO" | "BUSINESS",
        status: "ACTIVE",
        cancelAtPeriodEnd: false,
        currentPeriodStart: now,
        currentPeriodEnd: targetPlan === "FREE" ? null : nextYear,
      },
    });

    return NextResponse.json({
      success: true,
      subscription: {
        plan: updated.plan.toLowerCase(),
        status: updated.status,
      },
    });
  } catch (error) {
    console.error("Update subscription error:", error);
    return NextResponse.json(
      { error: "Failed to update subscription" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";
import { env } from "@/lib/env";
import type Stripe from "stripe";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      env.stripeWebhookSecret || process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error) {
    console.error("Webhook signature verification failed:", error);
    return NextResponse.json(
      { error: "Invalid signature" },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;

        if (userId && session.subscription) {
          const stripeSubscription = await stripe.subscriptions.retrieve(
            session.subscription as string
          );

          const priceId = stripeSubscription.items.data[0]?.price.id;
          const businessPriceId = env.stripeBusinessPriceId || process.env.STRIPE_BUSINESS_PRICE_ID;
          const plan =
            priceId && businessPriceId && priceId === businessPriceId
              ? "BUSINESS"
              : "PRO";

          const subObj = stripeSubscription as unknown as { current_period_start?: number; current_period_end?: number };
          const periodStart = subObj.current_period_start ? new Date(subObj.current_period_start * 1000) : new Date();
          const periodEnd = subObj.current_period_end ? new Date(subObj.current_period_end * 1000) : new Date();

          await db.subscription.upsert({
            where: { userId },
            create: {
              userId,
              stripeCustomerId: session.customer as string,
              stripeSubscriptionId: session.subscription as string,
              stripePriceId: priceId,
              plan,
              status: "ACTIVE",
              currentPeriodStart: periodStart,
              currentPeriodEnd: periodEnd,
            },
            update: {
              stripeSubscriptionId: session.subscription as string,
              stripePriceId: priceId,
              plan,
              status: "ACTIVE",
              currentPeriodStart: periodStart,
              currentPeriodEnd: periodEnd,
            },
          });
        }
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        const dbSub = await db.subscription.findFirst({
          where: { stripeCustomerId: customerId },
        });

        if (dbSub) {
          const status = subscription.status === "active" ? "ACTIVE" :
            subscription.status === "past_due" ? "PAST_DUE" :
            subscription.status === "canceled" ? "CANCELED" : "ACTIVE";

          const subObj = subscription as unknown as { current_period_start?: number; current_period_end?: number };
          const periodStart = subObj.current_period_start ? new Date(subObj.current_period_start * 1000) : new Date();
          const periodEnd = subObj.current_period_end ? new Date(subObj.current_period_end * 1000) : new Date();

          await db.subscription.update({
            where: { id: dbSub.id },
            data: {
              status,
              cancelAtPeriodEnd: subscription.cancel_at_period_end,
              currentPeriodStart: periodStart,
              currentPeriodEnd: periodEnd,
            },
          });
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        await db.subscription.updateMany({
          where: { stripeCustomerId: customerId },
          data: {
            status: "CANCELED",
            plan: "FREE",
          },
        });
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = invoice.customer as string;

        await db.subscription.updateMany({
          where: { stripeCustomerId: customerId },
          data: { status: "PAST_DUE" },
        });
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook handler error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}

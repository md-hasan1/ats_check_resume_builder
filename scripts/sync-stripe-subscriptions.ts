import "dotenv/config";
import { db } from "../src/lib/db";
import { stripe } from "../src/lib/stripe";
import { env } from "../src/lib/env";

async function syncSubscriptions() {
  console.log("Checking Stripe active subscriptions for all users...");
  const users = await db.user.findMany({
    include: { subscription: true },
  });

  for (const user of users) {
    console.log(`\nUser: ${user.email} (ID: ${user.id})`);
    console.log(`Current DB Plan: ${user.subscription?.plan || "NONE"}, StripeCustomerId: ${user.subscription?.stripeCustomerId || "NONE"}`);

    let customerId = user.subscription?.stripeCustomerId || null;

    if (!customerId && user.email) {
      const customers = await stripe.customers.list({ email: user.email, limit: 1 });
      if (customers.data.length > 0) {
        customerId = customers.data[0].id;
        console.log(`Found Stripe Customer by email: ${customerId}`);
      }
    }

    if (customerId) {
      const stripeSubs = await stripe.subscriptions.list({
        customer: customerId,
        status: "active",
        limit: 5,
      });

      console.log(`Found ${stripeSubs.data.length} active subscription(s) in Stripe.`);

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

        const updated = await db.subscription.upsert({
          where: { userId: user.id },
          create: {
            userId: user.id,
            stripeCustomerId: customerId,
            stripeSubscriptionId: activeSub.id,
            stripePriceId: priceId,
            plan,
            status: "ACTIVE",
            currentPeriodStart: periodStart,
            currentPeriodEnd: periodEnd,
          },
          update: {
            stripeCustomerId: customerId,
            stripeSubscriptionId: activeSub.id,
            stripePriceId: priceId,
            plan,
            status: "ACTIVE",
            cancelAtPeriodEnd: activeSub.cancel_at_period_end,
            currentPeriodStart: periodStart,
            currentPeriodEnd: periodEnd,
          },
        });

        console.log(`✅ Successfully updated DB Plan to ${updated.plan} for ${user.email}!`);
      }
    }
  }
}

syncSubscriptions()
  .catch(console.error)
  .finally(async () => {
    await db.$disconnect();
  });

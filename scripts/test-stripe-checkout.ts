import "dotenv/config";
import { stripe } from "../src/lib/stripe";
import { env } from "../src/lib/env";

async function testCheckout() {
  console.log("Using Stripe Secret Key:", env.stripeSecretKey?.substring(0, 15));
  console.log("Using Pro Price ID:", env.stripeProPriceId);

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: env.stripeProPriceId, quantity: 1 }],
      success_url: "http://localhost:3000/billing?success=true",
      cancel_url: "http://localhost:3000/billing?canceled=true",
    });

    console.log("✅ Stripe Checkout Session Created Successfully!");
    console.log("Checkout URL:", session.url);
  } catch (error) {
    console.error("❌ Stripe API Error:", error);
  }
}

testCheckout();

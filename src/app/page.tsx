import { Header } from "@/components/shared/header";
import { Footer } from "@/components/shared/footer";
import { Hero } from "@/components/landing/hero";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Features } from "@/components/landing/features";
import { CTASection } from "@/components/landing/cta-section";
import { FAQ } from "@/components/landing/faq";

export default function HomePage() {
  return (
    <>
      <Header />
      <main id="main-content">
        <Hero />
        <HowItWorks />
        <Features />
        <CTASection />
        <FAQ />
      </main>
      <Footer />
    </>
  );
}

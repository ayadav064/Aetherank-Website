import { Layout } from "@/components/Layout";
import { 
  Hero,
  AIAdvantage,
  GrowthPartner,
  Services, 
  WhyChooseUs, 
  CaseStudies, 
  Testimonials, 
  About, 
  Blog,
  HomeFAQ,
} from "@/components/Sections";

export default function Home() {
  // NOTE: title & meta are set server-side by app.ts (SSR) and updated
  // client-side by SeoManager. Do NOT set document.title here — it fires
  // after hydration and overwrites the SSR-injected value with a stale string,
  // causing a flash and breaking hydration consistency.
  return (
    <Layout>
      <div className="-mt-[88px]"> {/* Adjust for layout padding to let hero go under nav */}
        <Hero />
        <AIAdvantage />
        <GrowthPartner />
        <Services />
        <WhyChooseUs />
        <CaseStudies />
        <Testimonials />
        <About />
        <Blog />
        <HomeFAQ />
      </div>
    </Layout>
  );
}

import { useEffect } from "react";
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
  useEffect(() => {
    document.title = "Aetherank | Top Digital Marketing Agency in India";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute("content", "Scale your business with Aetherank, India's trusted AI-powered digital marketing agency based in India. We specialize in SEO, GEO, PPC, Social Media, and Web Design & Development.");
    }
  }, []);

  return (
    <Layout>
      <div className="-mt-[68px]"> {/* Adjust for layout padding to let hero go under nav */}
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

import { Layout } from "@/components/Layout";
import { FadeIn } from "@/components/ui/FadeIn";
import { Link } from "wouter";
import {
  ArrowRight, CheckCircle2, TrendingUp, Globe, Zap,
  BarChart2, Users, Star, MapPin, Award, Search,
} from "lucide-react";
import { ServiceFAQ, ServiceRelatedPosts } from "@/components/Sections";
import { usePageContent, useServicePageData } from "@/context/CmsContext";

const BENEFIT_ICONS = [
  <Search className="w-5 h-5" />,
  <TrendingUp className="w-5 h-5" />,
  <Globe className="w-5 h-5" />,
  <BarChart2 className="w-5 h-5" />,
  <Users className="w-5 h-5" />,
  <Zap className="w-5 h-5" />,
];

export default function DigitalMarketingIndiaPage() {
  const content = usePageContent("/digital-marketing-company-india");
  const serviceData = useServicePageData("/digital-marketing-company-india");

  return (
    <Layout>
      {/* Hero */}
      <div className="bg-slate-900 pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FadeIn>
            <div className="inline-flex items-center gap-2 bg-primary/20 text-primary text-sm font-semibold px-4 py-2 rounded-full mb-6">
              <MapPin className="w-4 h-4" /> Serving Businesses Across India
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6">
              {content.headline}{" "}
              <span className="text-primary">{content.headline_highlight}</span>
            </h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-10">
              {content.subheadline}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/free-audit"
                className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-primary text-white font-bold text-lg hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 hover:-translate-y-1"
              >
                {content.cta_text ?? "Get Free Marketing Audit"} <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              <Link
                href="/request-proposal"
                className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-white/10 text-white font-bold text-lg hover:bg-white/20 transition-all border border-white/20"
              >
                View Pricing
              </Link>
            </div>
          </FadeIn>

          {/* Trust bar */}
          <FadeIn delay={0.2}>
            <div className="mt-14 flex flex-wrap justify-center gap-8 text-slate-400 text-sm">
              {[
                { icon: <Award className="w-4 h-4" />, label: "#1 AI Marketing Agency in India" },
                { icon: <Star className="w-4 h-4 text-yellow-400" />, label: "Rated 4.9/5 · 100+ brands" },
                { icon: <Users className="w-4 h-4" />, label: "Pan-India coverage" },
                { icon: <TrendingUp className="w-4 h-4 text-primary" />, label: "+340% avg. traffic growth" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </div>

      {/* Benefits */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900">Why Choose Aetherank for Digital Marketing in India?</h2>
            <p className="text-slate-600 mt-4 max-w-2xl mx-auto">We combine cutting-edge AI tools with proven marketing strategy to grow Indian businesses faster than traditional agencies.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {serviceData.benefits.map((b, i) => (
              <FadeIn key={i} delay={i * 0.08}>
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 h-full">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-primary mb-4 shadow-sm">
                    {BENEFIT_ICONS[i % BENEFIT_ICONS.length]}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{b.title}</h3>
                  <p className="text-slate-600">{b.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Process + Case study */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <FadeIn>
              <h2 className="text-3xl font-bold text-slate-900 mb-6">How We Work</h2>
              <div className="space-y-8">
                {serviceData.process_steps.map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-12 h-12 shrink-0 bg-primary/10 text-primary font-bold rounded-full flex items-center justify-center">
                      {item.step}
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-slate-900 mb-1">{item.title}</h4>
                      <p className="text-slate-600">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </FadeIn>
            <FadeIn delay={0.2}>
              <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100">
                <div className="text-sm font-bold text-primary mb-2 uppercase tracking-wide">Mini Case Study</div>
                <h3 className="text-2xl font-bold text-slate-900 mb-6">Delhi E-commerce Brand — 6 Months</h3>
                <div className="grid grid-cols-2 gap-6 mb-8">
                  <div className="bg-slate-50 p-4 rounded-xl text-center">
                    <div className="text-slate-500 text-sm mb-1">Before</div>
                    <div className="text-xl font-bold text-slate-900">8k visits/mo</div>
                  </div>
                  <div className="bg-emerald-50 p-4 rounded-xl text-center border border-emerald-100">
                    <div className="text-emerald-600 text-sm mb-1">After</div>
                    <div className="text-2xl font-bold text-emerald-700">47k visits/mo</div>
                  </div>
                </div>
                <p className="text-slate-600 italic">"Aetherank's strategy tripled our revenue in 6 months. Their transparency and AI-driven approach set them apart from every other agency we've tried."</p>
                <p className="mt-3 text-sm font-semibold text-slate-800">— Founder, Delhi Fashion Brand</p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900">Transparent Pricing for Indian Businesses</h2>
            <p className="text-slate-600 mt-4">No hidden fees. No lock-in. Cancel anytime.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {serviceData.pricing.map((plan, i) => (
              <div key={i} className={`p-8 rounded-3xl border relative ${plan.popular ? "border-primary shadow-xl" : "border-slate-200"}`}>
                {plan.popular && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full">
                    MOST POPULAR
                  </div>
                )}
                <h3 className="text-xl font-bold text-slate-900 mb-2">{plan.name}</h3>
                <div className="text-3xl font-black text-slate-900 mb-4">{plan.price}</div>
                <p className="text-slate-600 mb-5">{plan.desc}</p>
                <ul className="space-y-2.5 mb-8 border-t border-slate-100 pt-5">
                  {plan.features.map((f, fi) => (
                    <li key={fi} className="flex items-start gap-2.5 text-sm text-slate-700">
                      <CheckCircle2 className={`w-4 h-4 mt-0.5 shrink-0 ${plan.popular ? "text-primary" : "text-emerald-500"}`} />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/request-proposal"
                  className={`block text-center py-3 rounded-xl font-bold transition-colors ${plan.popular ? "bg-primary text-white hover:bg-primary/90" : "bg-slate-100 text-slate-900 hover:bg-slate-200"}`}
                >
                  Get Started
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cities served */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Cities We Serve Across India</h2>
          <p className="text-slate-600 mb-8">From metro hubs to emerging Tier-2 markets — we've got your city covered.</p>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              "Mumbai", "Delhi", "Bangalore", "Hyderabad", "Pune",
              "Chennai", "Ahmedabad", "Kolkata", "Surat", "Jaipur",
              "Lucknow", "Chandigarh", "Indore", "Coimbatore", "Kochi",
            ].map((city) => (
              <span key={city} className="inline-flex items-center gap-1.5 bg-white border border-slate-200 text-slate-700 text-sm font-medium px-4 py-2 rounded-full shadow-sm">
                <MapPin className="w-3.5 h-3.5 text-primary" /> {city}
              </span>
            ))}
          </div>
        </div>
      </section>

      <ServiceRelatedPosts category="SEO" />
      <ServiceFAQ
        faqs={serviceData.faqs?.length ? serviceData.faqs : []}
        headline={<>Digital Marketing Questions<br /><span className="text-primary">Answered for India</span></>}
        subtext="Everything Indian businesses ask before partnering with a digital marketing agency."
      />
    </Layout>
  );
}

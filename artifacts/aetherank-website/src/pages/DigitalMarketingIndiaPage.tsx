import { Layout } from "@/components/Layout";
import { FadeIn } from "@/components/ui/FadeIn";
import { Link } from "wouter";
import {
  ArrowRight, CheckCircle2, TrendingUp, Globe, Zap,
  BarChart2, Users, Star, MapPin, Award, Search,
} from "lucide-react";
import { ServiceFAQ, ServiceRelatedPosts } from "@/components/Sections";

const FAQS = [
  {
    q: "Why should I choose a digital marketing agency in India?",
    a: "India offers world-class talent at competitive prices. Agencies like Aetherank combine deep local market knowledge with global best practices — covering SEO, PPC, Meta Ads, content, and AI-driven strategies — to deliver measurable ROI for Indian and international brands.",
  },
  {
    q: "Which cities do you serve across India?",
    a: "We serve clients pan-India including Mumbai, Delhi NCR, Bangalore, Hyderabad, Pune, Chennai, Ahmedabad, Kolkata, Surat, and all Tier-2 and Tier-3 cities. All campaign management is done remotely with weekly video calls and monthly reporting.",
  },
  {
    q: "What digital marketing services do you offer in India?",
    a: "We offer SEO & GEO (AI search), Google PPC, Meta & Instagram Ads, Social Media Management, Content Marketing, Web Design & Development, and Online Reputation Management. Every engagement begins with a free website audit.",
  },
  {
    q: "How long before we see results?",
    a: "PPC and Meta Ads can deliver leads within the first week. SEO typically shows meaningful ranking improvements in 3–6 months. We track 25+ KPIs monthly and share transparent reports so you always know what's working.",
  },
  {
    q: "Do you work with small businesses and startups in India?",
    a: "Yes. Our starter plans begin at ₹15,000/month, making professional digital marketing accessible to SMEs and startups. We scale your campaigns as your business grows.",
  },
  {
    q: "What makes Aetherank different from other Indian digital marketing agencies?",
    a: "We integrate AI-powered tools into every campaign — from ChatGPT-optimised content to AI-driven ad bidding — giving you an unfair advantage in 2026. All work is done in-house with full transparency; no outsourcing.",
  },
];

const BENEFITS = [
  { icon: <Search className="w-5 h-5" />, title: "SEO + AI Search (GEO)", desc: "Rank on Google AND appear in ChatGPT, Perplexity, and Google AI Overviews so you capture every type of search intent across India." },
  { icon: <TrendingUp className="w-5 h-5" />, title: "Performance-Driven PPC", desc: "ROI-focused Google Ads and Meta campaigns with granular targeting by city, language, and device for the Indian market." },
  { icon: <Globe className="w-5 h-5" />, title: "Pan-India Local SEO", desc: "Dominate Google Maps and local packs in every city you operate — Mumbai, Delhi, Bangalore, Hyderabad, Pune and beyond." },
  { icon: <BarChart2 className="w-5 h-5" />, title: "Data-Backed Strategy", desc: "Every decision is driven by analytics. We connect Google Analytics 4, Search Console, and custom dashboards for real-time insights." },
  { icon: <Users className="w-5 h-5" />, title: "Social Media Growth", desc: "Instagram, LinkedIn, YouTube, and Facebook strategies that build audiences and convert followers into paying customers." },
  { icon: <Zap className="w-5 h-5" />, title: "AI-Powered Content", desc: "High-quality blog posts, landing pages, and ad creatives produced at scale with AI assistance and human expertise." },
];

const PROCESS = [
  { step: "01", title: "Free Website & Marketing Audit", desc: "We analyse your current website, SEO rankings, ad spend, and competitors across India — completely free." },
  { step: "02", title: "Custom Strategy Blueprint", desc: "A tailored 90-day plan covering channels, budget allocation, and KPIs specific to your industry and target cities." },
  { step: "03", title: "Campaign Launch", desc: "Our team sets up and launches all campaigns within 7 days — ads, content, SEO, and social media in parallel." },
  { step: "04", title: "Monthly Reporting & Optimisation", desc: "Detailed monthly reports with keyword rankings, traffic, leads, ROAS, and a clear plan for the month ahead." },
];

const PRICING = [
  {
    name: "Starter",
    price: "₹15,000/mo",
    desc: "Perfect for small businesses and startups entering digital marketing.",
    features: ["SEO – 10 keywords", "Google Ads management", "Monthly report", "Email support"],
    popular: false,
  },
  {
    name: "Growth",
    price: "₹35,000/mo",
    desc: "Full-funnel marketing for growing brands ready to scale across India.",
    features: ["SEO + GEO – 30 keywords", "Google & Meta Ads", "Social Media (2 platforms)", "Bi-weekly strategy call", "Priority support"],
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    desc: "Comprehensive multi-city campaigns for established businesses.",
    features: ["Unlimited keywords", "Full-channel campaigns", "Dedicated account manager", "Weekly calls + live dashboard", "CRO & landing pages"],
    popular: false,
  },
];

export default function DigitalMarketingIndiaPage() {
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
              Best Digital Marketing{" "}
              <span className="text-primary">Company in India</span>
            </h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-10">
              AI-powered SEO, Google Ads, Meta Ads, and social media marketing that drives real leads and revenue for Indian businesses — with full transparency and no lock-in contracts.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/free-audit"
                className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-primary text-white font-bold text-lg hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 hover:-translate-y-1"
              >
                Get Free Marketing Audit <ArrowRight className="w-5 h-5 ml-2" />
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
            {BENEFITS.map((b, i) => (
              <FadeIn key={i} delay={i * 0.08}>
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 h-full">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-primary mb-4 shadow-sm">
                    {b.icon}
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
                {PROCESS.map((item, i) => (
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
            {PRICING.map((plan, i) => (
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
        faqs={FAQS}
        headline={<>Digital Marketing Questions<br /><span className="text-primary">Answered for India</span></>}
        subtext="Everything Indian businesses ask before partnering with a digital marketing agency."
      />
    </Layout>
  );
}

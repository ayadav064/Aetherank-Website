import { Layout } from "@/components/Layout";
import { FadeIn } from "@/components/ui/FadeIn";
import { Link } from "wouter";
import {
  ArrowRight, CheckCircle2, TrendingUp, Globe, Zap,
  BarChart2, Users, Star, MapPin, Award, Search, Building2,
} from "lucide-react";
import { ServiceFAQ, ServiceRelatedPosts } from "@/components/Sections";

const FAQS = [
  {
    q: "Why hire a digital marketing agency in Mumbai?",
    a: "Mumbai is India's commercial capital, home to some of the most competitive industries — real estate, finance, fashion, hospitality, and retail. A Mumbai-focused agency understands the local consumer, Marathi-speaking audience segments, and hyper-local competition, giving your campaigns an immediate edge.",
  },
  {
    q: "What digital marketing services do you offer in Mumbai?",
    a: "We offer SEO, GEO (AI search optimisation), Google Ads, Meta & Instagram Ads, LinkedIn Ads for B2B, Social Media Management, Content Marketing, Web Design, and Online Reputation Management — all tailored for the Mumbai market.",
  },
  {
    q: "Do you offer local SEO for specific Mumbai areas?",
    a: "Absolutely. We optimise for hyper-local searches like 'digital marketing agency in Andheri', 'SEO company in Bandra', and 'Google Ads expert in Lower Parel'. We build and manage your Google Business Profile, local citations, and neighbourhood-level content.",
  },
  {
    q: "How quickly can you start campaigns in Mumbai?",
    a: "We launch within 7 business days of onboarding. We start with a free audit, build your strategy, and begin campaign execution — all simultaneously to minimise time-to-results.",
  },
  {
    q: "What industries do you serve in Mumbai?",
    a: "Real estate, retail & e-commerce, hospitality & restaurants, finance & fintech, fashion & lifestyle, healthcare & clinics, education & coaching, and professional services (legal, CA, consulting).",
  },
  {
    q: "What is your pricing for Mumbai clients?",
    a: "Packages start at ₹15,000/month for startups and SMEs. Growth plans with full-funnel management start at ₹35,000/month. We offer a 100% free audit before you commit to anything.",
  },
];

const BENEFITS = [
  { icon: <Search className="w-5 h-5" />, title: "Mumbai-Focused SEO", desc: "Rank for high-intent local searches in Andheri, Bandra, Powai, Lower Parel, Thane, Navi Mumbai, and across Greater Mumbai." },
  { icon: <TrendingUp className="w-5 h-5" />, title: "Meta & Instagram Ads", desc: "Mumbai's consumers are social-first. Our Instagram and Facebook campaigns deliver leads at the lowest possible cost-per-acquisition." },
  { icon: <Globe className="w-5 h-5" />, title: "AI Search (GEO)", desc: "Get your brand recommended by ChatGPT and Google AI Overviews when Mumbai users ask for your type of product or service." },
  { icon: <BarChart2 className="w-5 h-5" />, title: "Google Ads & PPC", desc: "ROI-driven Google Search and Display campaigns targeting Mumbai's competitive keywords with proven bidding strategies." },
  { icon: <Building2 className="w-5 h-5" />, title: "Real Estate Marketing", desc: "Specialised campaigns for Mumbai builders, brokers, and co-working spaces — driving quality inquiries for premium and affordable projects." },
  { icon: <Zap className="w-5 h-5" />, title: "Fast Results, Full Transparency", desc: "Weekly progress updates, live dashboards, and no lock-in contracts. See exactly what you're getting for every rupee spent." },
];

const PROCESS = [
  { step: "01", title: "Free Mumbai Market Audit", desc: "Comprehensive analysis of your website, keyword rankings, competitors in Mumbai, and existing ad performance." },
  { step: "02", title: "Localised Strategy Blueprint", desc: "A custom plan targeting the right Mumbai neighbourhoods, audiences, and platforms — aligned to your budget and goals." },
  { step: "03", title: "7-Day Campaign Launch", desc: "We go live with SEO, paid ads, content, and social media — simultaneously — within one week of sign-off." },
  { step: "04", title: "Monthly Reports & Growth Reviews", desc: "Detailed reports covering traffic, leads, rankings, ROAS, and next-month priorities. You always know what's next." },
];

const PRICING = [
  {
    name: "Starter",
    price: "₹15,000/mo",
    desc: "Ideal for small Mumbai businesses entering digital marketing.",
    features: ["Local SEO – 10 keywords", "Google My Business optimisation", "Google Ads management", "Monthly report"],
    popular: false,
  },
  {
    name: "Growth",
    price: "₹35,000/mo",
    desc: "Full-funnel campaigns for Mumbai brands ready to scale.",
    features: ["SEO + GEO – 30 keywords", "Google & Meta Ads", "Instagram management", "Bi-weekly strategy call", "Priority support"],
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    desc: "Aggressive multi-platform marketing for established Mumbai businesses.",
    features: ["Unlimited keywords", "All ad platforms", "Dedicated account manager", "Weekly calls + live dashboard", "CRO & landing pages"],
    popular: false,
  },
];

const MUMBAI_AREAS = [
  "Andheri", "Bandra", "Borivali", "Dadar", "Goregaon",
  "Kandivali", "Kurla", "Lower Parel", "Malad", "Mulund",
  "Powai", "Thane", "Navi Mumbai", "Vashi", "Worli",
];

export default function DigitalMarketingMumbaiPage() {
  return (
    <Layout>
      {/* Hero */}
      <div className="bg-slate-900 pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FadeIn>
            <div className="inline-flex items-center gap-2 bg-primary/20 text-primary text-sm font-semibold px-4 py-2 rounded-full mb-6">
              <MapPin className="w-4 h-4" /> Mumbai's #1 Digital Marketing Agency
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6">
              Digital Marketing Company{" "}
              <span className="text-primary">in Mumbai</span>
            </h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-10">
              AI-powered SEO, Google Ads, Meta & Instagram Ads for Mumbai businesses. More leads, more revenue — with zero guesswork and complete transparency.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/free-audit"
                className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-primary text-white font-bold text-lg hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 hover:-translate-y-1"
              >
                Get Free Mumbai Audit <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              <Link
                href="/request-proposal"
                className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-white/10 text-white font-bold text-lg hover:bg-white/20 transition-all border border-white/20"
              >
                View Pricing
              </Link>
            </div>
          </FadeIn>

          <FadeIn delay={0.2}>
            <div className="mt-14 flex flex-wrap justify-center gap-8 text-slate-400 text-sm">
              {[
                { icon: <Award className="w-4 h-4" />, label: "#1 AI Marketing Agency in Mumbai" },
                { icon: <Star className="w-4 h-4 text-yellow-400" />, label: "Rated 4.9/5 · 100+ brands" },
                { icon: <MapPin className="w-4 h-4 text-primary" />, label: "Serving all of Greater Mumbai" },
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
            <h2 className="text-3xl font-bold text-slate-900">Why Aetherank is Mumbai's Top Digital Marketing Agency</h2>
            <p className="text-slate-600 mt-4 max-w-2xl mx-auto">We combine AI-driven strategy with deep knowledge of the Mumbai market to deliver campaigns that outperform the competition.</p>
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
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Our Process for Mumbai Clients</h2>
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
                <h3 className="text-2xl font-bold text-slate-900 mb-6">Bandra Real Estate Agency — 4 Months</h3>
                <div className="grid grid-cols-2 gap-6 mb-8">
                  <div className="bg-slate-50 p-4 rounded-xl text-center">
                    <div className="text-slate-500 text-sm mb-1">Before</div>
                    <div className="text-xl font-bold text-slate-900">3 leads/mo</div>
                  </div>
                  <div className="bg-emerald-50 p-4 rounded-xl text-center border border-emerald-100">
                    <div className="text-emerald-600 text-sm mb-1">After</div>
                    <div className="text-2xl font-bold text-emerald-700">64 leads/mo</div>
                  </div>
                </div>
                <p className="text-slate-600 italic">"Our Google Ads were bleeding money before Aetherank. Now we have a consistent flow of qualified property inquiries every single week."</p>
                <p className="mt-3 text-sm font-semibold text-slate-800">— Director, Bandra Real Estate Agency</p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900">Digital Marketing Packages for Mumbai Businesses</h2>
            <p className="text-slate-600 mt-4">Transparent pricing. No hidden costs. Cancel anytime.</p>
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

      {/* Mumbai areas */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">We Serve All Areas of Mumbai</h2>
          <p className="text-slate-600 mb-8">Hyper-local campaigns for every neighbourhood in Greater Mumbai and Navi Mumbai.</p>
          <div className="flex flex-wrap justify-center gap-3">
            {MUMBAI_AREAS.map((area) => (
              <span key={area} className="inline-flex items-center gap-1.5 bg-white border border-slate-200 text-slate-700 text-sm font-medium px-4 py-2 rounded-full shadow-sm">
                <MapPin className="w-3.5 h-3.5 text-primary" /> {area}
              </span>
            ))}
          </div>
        </div>
      </section>

      <ServiceRelatedPosts category="SEO" />
      <ServiceFAQ
        faqs={FAQS}
        headline={<>Digital Marketing Questions<br /><span className="text-primary">for Mumbai Businesses</span></>}
        subtext="Answers to the most common questions from Mumbai entrepreneurs, SMEs, and startups about growing online."
      />
    </Layout>
  );
}

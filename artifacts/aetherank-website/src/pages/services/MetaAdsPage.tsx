import { Layout } from "@/components/Layout";
import { FadeIn } from "@/components/ui/FadeIn";
import { Link } from "wouter";
import { ArrowRight, CheckCircle2, Megaphone, Target, TrendingUp, BarChart, Zap, Users, RefreshCw } from "lucide-react";
import { ServiceFAQ, ServiceRelatedPosts } from "@/components/Sections";
import { usePageContent, useServicePageData } from "@/context/CmsContext";

const META_FAQS = [
  { q: "What is Meta Ads and how is it different from Google Ads?", a: "Meta Ads (formerly Facebook Ads) runs on Facebook and Instagram, targeting users based on demographics, interests, and behaviours. Google Ads targets people actively searching for something. Meta Ads excels at demand generation — reaching people before they search, building brand awareness, and driving social commerce. Both are powerful, and we often recommend running them together for full-funnel coverage." },
  { q: "How much budget do I need to start running Meta Ads?", a: "We recommend a minimum ad spend of ₹20,000–₹30,000 per month to generate enough data for meaningful optimisation. Campaigns can technically run on less, but the Meta algorithm needs volume to learn efficiently. Our management fee is separate from your ad spend, and we make every rupee work as hard as possible." },
  { q: "Can you create the ad creatives or do I need to provide them?", a: "We handle end-to-end creative production — including graphic design, video editing, carousel ads, and ad copywriting. You provide your product images, brand guidelines, and any raw footage, and we craft conversion-focused creatives. We A/B test multiple creative variants to find what resonates best with your audience." },
  { q: "How long does it take to see results from Meta Ads?", a: "Meta Ads can drive traffic and leads from day one, but the algorithm needs 7–14 days in a 'learning phase' before performance stabilises. Meaningful ROAS and conversion optimisation typically happens from week 3 onwards. We set realistic expectations and provide weekly performance updates throughout." },
  { q: "Do you manage both Facebook and Instagram ads together?", a: "Yes. Meta's Ads Manager lets us run campaigns across Facebook, Instagram, Messenger, and the Audience Network from a single interface. We tailor creative formats to each placement — Reels for Instagram, Feed posts for Facebook, Stories for both — to maximise engagement and conversions on every surface." },
  { q: "How do you track conversions and ROI from Meta Ads?", a: "We install and verify the Meta Pixel and Conversion API on your website, set up custom conversion events (purchases, leads, sign-ups), and connect your ad account to your CRM where applicable. This gives us accurate attribution data, closing the loop between ad spend and actual revenue — not just clicks." },
];

const META_BENEFIT_ICONS = [
  <Target className="w-5 h-5" />,
  <Users className="w-5 h-5" />,
  <Zap className="w-5 h-5" />,
  <RefreshCw className="w-5 h-5" />,
  <BarChart className="w-5 h-5" />,
  <TrendingUp className="w-5 h-5" />,
];

export default function MetaAdsPage() {
  const content = usePageContent("/services/meta-ads");
  const serviceData = useServicePageData("/services/meta-ads");
  return (
    <Layout>
      <div className="bg-slate-900 pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FadeIn>
            <div className="w-16 h-16 bg-blue-600/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Megaphone className="w-8 h-8 text-blue-500" />
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6">
              {content.headline} <span className="text-blue-500">{content.headline_highlight}</span>
            </h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-10">
              {content.subheadline}
            </p>
            <Link href="/free-audit" className="inline-flex items-center px-8 py-4 rounded-xl bg-primary text-white font-bold text-lg hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 hover:-translate-y-1">
              {content.cta_text ?? "Get Free Meta Ads Audit"} <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </FadeIn>
        </div>
      </div>

      {/* Key Benefits */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900">Key Benefits</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {serviceData.benefits.map((benefit, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 h-full">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-blue-600 mb-4 shadow-sm">
                    {META_BENEFIT_ICONS[i % META_BENEFIT_ICONS.length]}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{benefit.title}</h3>
                  <p className="text-slate-600">{benefit.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Our Process + Case Study */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <FadeIn>
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Our Process</h2>
              <div className="space-y-8">
                {serviceData.process_steps.map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-12 h-12 shrink-0 bg-blue-600/10 text-blue-700 font-bold rounded-full flex items-center justify-center">
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
                <div className="text-sm font-bold text-blue-600 mb-2 uppercase tracking-wide">Mini Case Study</div>
                <h3 className="text-2xl font-bold text-slate-900 mb-6">D2C Fashion Brand Scale-Up</h3>
                <div className="grid grid-cols-2 gap-6 mb-8">
                  <div className="bg-slate-50 p-4 rounded-xl text-center">
                    <div className="text-slate-500 text-sm mb-1">Before ROAS</div>
                    <div className="text-xl font-bold text-slate-900">1.4x</div>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-xl text-center border border-blue-100">
                    <div className="text-blue-600 text-sm mb-1">After ROAS (2 mo)</div>
                    <div className="text-2xl font-bold text-blue-700">5.8x</div>
                  </div>
                </div>
                <p className="text-slate-600 italic">"Aetherank rebuilt our Meta campaigns from scratch. Revenue from social ads went from ₹3L to ₹18L per month in 60 days."</p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Platforms we advertise on */}
      <section className="py-16 bg-white border-y border-slate-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-3">Platforms We Manage</h2>
          <p className="text-slate-600 mb-10">Full-funnel Meta advertising across every placement.</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: "Facebook Feed", desc: "News feed ads, link posts & lead forms" },
              { name: "Instagram Feed", desc: "Photo & video ads, Shopping tags" },
              { name: "Reels & Stories", desc: "Full-screen immersive ad placements" },
              { name: "Audience Network", desc: "Extended reach beyond Meta apps" },
            ].map((p, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50 text-left hover:border-blue-200 hover:bg-blue-50/40 transition-colors">
                  <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center mb-3">
                    <Megaphone className="w-4 h-4 text-blue-600" />
                  </div>
                  <p className="font-bold text-slate-900 text-sm mb-1">{p.name}</p>
                  <p className="text-slate-500 text-xs">{p.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900">Meta Ads Pricing</h2>
            <p className="text-slate-600 mt-4">Transparent management fees based on campaign scope.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {serviceData.pricing.map((plan, i) => (
              <div key={i} className={`p-8 rounded-3xl border ${plan.popular ? "border-blue-600 shadow-xl relative" : "border-slate-200 bg-white"}`}>
                {plan.popular && <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">MOST POPULAR</div>}
                <h3 className="text-xl font-bold text-slate-900 mb-2">{plan.name}</h3>
                <div className="text-3xl font-black text-slate-900 mb-4">{plan.price}</div>
                <p className="text-slate-600 mb-5">{plan.desc}</p>
                {plan.features && plan.features.length > 0 && (
                  <ul className="space-y-2.5 mb-8 border-t border-slate-100 pt-5">
                    {plan.features.map((f, fi) => (
                      <li key={fi} className="flex items-start gap-2.5 text-sm text-slate-700">
                        <CheckCircle2 className={`w-4 h-4 mt-0.5 shrink-0 ${plan.popular ? "text-blue-600" : "text-emerald-500"}`} />
                        {f}
                      </li>
                    ))}
                  </ul>
                )}
                <Link href="/request-proposal" className={`block text-center py-3 rounded-xl font-bold transition-colors ${plan.popular ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-slate-100 text-slate-900 hover:bg-slate-200"}`}>
                  Get Started
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ServiceRelatedPosts category="Meta Ads" />
      <ServiceFAQ
        faqs={serviceData.faqs?.length ? serviceData.faqs : META_FAQS}
        headline={<>Questions About<br /><span className="text-blue-500">Meta Ads?</span></>}
        subtext="Everything you need to know about running Facebook & Instagram campaigns that actually drive revenue."
      />
    </Layout>
  );
}

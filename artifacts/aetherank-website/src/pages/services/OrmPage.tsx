import { Layout } from "@/components/Layout";
import { FadeIn } from "@/components/ui/FadeIn";
import { usePageContent } from "@/context/CmsContext";
import { Link } from "wouter";
import { ArrowRight, CheckCircle2, ShieldCheck, Star, Trash2, Eye, Award, MessageSquareWarning } from "lucide-react";
import { ServiceFAQ, ServiceRelatedPosts } from "@/components/Sections";
import { useServicePageData } from "@/context/CmsContext";

const ORM_FAQS = [
  { q: "What exactly is Online Reputation Management (ORM)?", a: "ORM is the practice of monitoring, influencing, and improving how your brand appears online. This includes managing Google reviews, suppressing negative search results, amplifying positive mentions, building authoritative content that ranks for your brand name, and responding to customer feedback across review platforms." },
  { q: "Can you remove negative Google reviews permanently?", a: "We can flag and request removal of reviews that violate Google's policies (spam, fake reviews, off-topic content). For legitimate negative reviews, we employ a proven response and resolution strategy that minimises their impact. We also work to generate a high volume of genuine positive reviews so your overall rating improves significantly." },
  { q: "How long does it take to improve a brand's online reputation?", a: "Visible improvements typically take 3–6 months. Quick wins like responding professionally to reviews and generating new positive ones can shift perception within 4–8 weeks. Suppressing negative search results or news articles through content displacement is a 6–12 month process, depending on how entrenched the content is." },
  { q: "Do you help businesses generate more genuine positive reviews?", a: "Yes. We implement a systematic review-generation strategy that prompts satisfied customers to share their experience at exactly the right moment in the customer journey. This is done ethically and in full compliance with Google's and other platforms' review policies." },
  { q: "Which platforms do you manage for ORM — just Google, or others too?", a: "We manage your reputation across all major platforms: Google Business Profile, Trustpilot, Glassdoor, MouthShut, JustDial, Facebook, LinkedIn, Yelp, and industry-specific review sites. We also monitor news articles, forums, and social media mentions using real-time brand tracking tools." },
  { q: "Can ORM help a business recover after a PR crisis?", a: "Absolutely. Crisis ORM is one of our specialities. We deploy a structured approach: immediate damage assessment, professional response strategy, content creation to take control of the narrative, and proactive promotion of positive press to push negative content down in search results." },
];

const ORM_BENEFIT_ICONS = [
  <Star className="w-5 h-5" />,
  <Trash2 className="w-5 h-5" />,
  <Eye className="w-5 h-5" />,
  <Award className="w-5 h-5" />,
  <MessageSquareWarning className="w-5 h-5" />,
  <CheckCircle2 className="w-5 h-5" />,
];

export default function OrmPage() {
  const content = usePageContent("/services/orm");
  const serviceData = useServicePageData("/services/orm");
  return (
    <Layout>
      <div className="bg-slate-900 pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FadeIn>
            <div className="w-16 h-16 bg-red-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <ShieldCheck className="w-8 h-8 text-red-500" />
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6">
              {content.headline} <span className="text-red-500">{content.headline_highlight}</span>
            </h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-10">
              {content.subheadline}
            </p>
            <Link href="/free-audit" className="inline-flex items-center px-8 py-4 rounded-xl bg-primary text-white font-bold text-lg hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 hover:-translate-y-1">{content.cta_text ?? "Get Free Brand Audit"} <ArrowRight className="w-5 h-5 ml-2" /></Link>
          </FadeIn>
        </div>
      </div>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900">Key Benefits</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {serviceData.benefits.map((benefit, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 h-full">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-red-500 mb-4 shadow-sm">
                    {ORM_BENEFIT_ICONS[i % ORM_BENEFIT_ICONS.length]}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{benefit.title}</h3>
                  <p className="text-slate-600">{benefit.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <FadeIn>
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Our Process</h2>
              <div className="space-y-8">
                {serviceData.process_steps.map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-12 h-12 shrink-0 bg-red-500/10 text-red-600 font-bold rounded-full flex items-center justify-center">
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
                <div className="text-sm font-bold text-red-500 mb-2 uppercase tracking-wide">Mini Case Study</div>
                <h3 className="text-2xl font-bold text-slate-900 mb-6">Hospital Chain Recovery</h3>
                <div className="grid grid-cols-2 gap-6 mb-8">
                  <div className="bg-slate-50 p-4 rounded-xl text-center">
                    <div className="text-slate-500 text-sm mb-1">Before Rating</div>
                    <div className="text-xl font-bold text-slate-900">2.8 Stars</div>
                  </div>
                  <div className="bg-red-50 p-4 rounded-xl text-center border border-red-100">
                    <div className="text-red-700 text-sm mb-1">After 4 Months</div>
                    <div className="text-2xl font-bold text-red-800">4.6 Stars</div>
                  </div>
                </div>
                <p className="text-slate-600 italic">"They suppressed a malicious fake news article and helped us collect over 500 genuine patient reviews. It saved our reputation."</p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900">Pricing Plans</h2>
            <p className="text-slate-600 mt-4">Discreet, professional protection for your brand.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {serviceData.pricing.map((plan, i) => (
              <div key={i} className={`p-8 rounded-3xl border ${plan.popular ? 'border-red-500 shadow-xl relative' : 'border-slate-200'}`}>
                {plan.popular && <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">MOST POPULAR</div>}
                <h3 className="text-xl font-bold text-slate-900 mb-2">{plan.name}</h3>
                <div className="text-3xl font-black text-slate-900 mb-4">{plan.price}</div>
                <p className="text-slate-600 mb-5">{plan.desc}</p>
                {plan.features && plan.features.length > 0 && (
                  <ul className="space-y-2.5 mb-8 border-t border-slate-100 pt-5">
                    {plan.features.map((f, fi) => (
                      <li key={fi} className="flex items-start gap-2.5 text-sm text-slate-700">
                        <CheckCircle2 className={`w-4 h-4 mt-0.5 shrink-0 ${plan.popular ? 'text-red-500' : 'text-emerald-500'}`} />
                        {f}
                      </li>
                    ))}
                  </ul>
                )}
                <Link href="/request-proposal" className={`block text-center py-3 rounded-xl font-bold transition-colors ${plan.popular ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-slate-100 text-slate-900 hover:bg-slate-200'}`}>Get Started</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ServiceRelatedPosts category="ORM" />
      <ServiceFAQ
        faqs={serviceData.faqs?.length ? serviceData.faqs : ORM_FAQS}
        headline={<>Questions About<br /><span className="text-emerald-500">Reputation Management?</span></>}
        subtext="Clear answers on reviews, timelines, platforms, and how we protect and build your brand's image."
      />
    </Layout>
  );
}

import { Layout } from "@/components/Layout";
import { FadeIn } from "@/components/ui/FadeIn";
import { usePageContent } from "@/context/CmsContext";
import { Link } from "wouter";
import { ArrowRight, CheckCircle2, PenTool, BookOpen, Search, Megaphone, FileText, Share2 } from "lucide-react";
import { ServiceFAQ, ServiceRelatedPosts } from "@/components/Sections";
import { useServicePageData } from "@/context/CmsContext";

const CONTENT_FAQS = [
  { q: "How many blog posts or articles do you write per month?", a: "Our packages typically include 4–8 long-form articles per month (1,500–3,000 words each), plus supporting content like infographics, social media snippets, email newsletters, or video scripts. The volume depends on your niche, goals, and budget." },
  { q: "Do you research keywords before writing content?", a: "Always. Every piece of content begins with keyword research and competitor gap analysis. We identify topics with a realistic chance of ranking based on your domain authority, target audience search intent, and competition level — so your content investments go to work immediately." },
  { q: "What types of content do you create beyond blog posts?", a: "We produce a full range of content: long-form articles, pillar pages, case studies, white papers, email sequences, video scripts, LinkedIn thought-leadership posts, infographics, product descriptions, landing page copy, and press releases." },
  { q: "How long does it take for content to start ranking on Google?", a: "New content typically begins moving in rankings within 3–6 months as Google indexes and evaluates it. Well-optimised content targeting low-competition keywords can rank within weeks. We track keyword movements monthly and refresh underperforming content to accelerate results." },
  { q: "Do you write content for all industries?", a: "We work across a wide range of industries including e-commerce, SaaS, real estate, healthcare, education, fintech, professional services, and more. For highly technical sectors, we have subject-matter expert writers and always include a client review step before publishing." },
  { q: "How do you measure content marketing success?", a: "We track organic traffic, keyword rankings, time-on-page, bounce rate, backlinks earned, leads generated from content, and revenue-attributed traffic (via UTM tracking and Google Analytics). You get a monthly content performance report alongside our ongoing recommendations." },
];

const CM_BENEFIT_ICONS = [
  <BookOpen className="w-5 h-5" />,
  <Search className="w-5 h-5" />,
  <Megaphone className="w-5 h-5" />,
  <FileText className="w-5 h-5" />,
  <Share2 className="w-5 h-5" />,
  <CheckCircle2 className="w-5 h-5" />,
];

export default function ContentMarketingPage() {
  const content = usePageContent("/services/content-marketing");
  const serviceData = useServicePageData("/services/content-marketing");
  return (
    <Layout>
      <div className="bg-slate-900 pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FadeIn>
            <div className="w-16 h-16 bg-amber-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <PenTool className="w-8 h-8 text-amber-500" />
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6">
              {content.headline} <span className="text-amber-500">{content.headline_highlight}</span>
            </h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-10">
              {content.subheadline}
            </p>
            <Link href="/free-audit" className="inline-flex items-center px-8 py-4 rounded-xl bg-primary text-white font-bold text-lg hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 hover:-translate-y-1">{content.cta_text ?? "Get Content Audit"} <ArrowRight className="w-5 h-5 ml-2" /></Link>
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
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-amber-500 mb-4 shadow-sm">
                    {CM_BENEFIT_ICONS[i % CM_BENEFIT_ICONS.length]}
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
                    <div className="w-12 h-12 shrink-0 bg-amber-500/10 text-amber-600 font-bold rounded-full flex items-center justify-center">
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
                <div className="text-sm font-bold text-amber-500 mb-2 uppercase tracking-wide">Mini Case Study</div>
                <h3 className="text-2xl font-bold text-slate-900 mb-6">B2B Software Blog</h3>
                <div className="grid grid-cols-2 gap-6 mb-8">
                  <div className="bg-slate-50 p-4 rounded-xl text-center">
                    <div className="text-slate-500 text-sm mb-1">Before Leads/mo</div>
                    <div className="text-xl font-bold text-slate-900">45</div>
                  </div>
                  <div className="bg-amber-50 p-4 rounded-xl text-center border border-amber-100">
                    <div className="text-amber-700 text-sm mb-1">After Content Engine</div>
                    <div className="text-2xl font-bold text-amber-800">320</div>
                  </div>
                </div>
                <p className="text-slate-600 italic">"The in-depth guides they produced became our main source of high-ticket enterprise leads."</p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900">Pricing Plans</h2>
            <p className="text-slate-600 mt-4">High-quality content tailored to your needs.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {serviceData.pricing.map((plan, i) => (
              <div key={i} className={`p-8 rounded-3xl border ${plan.popular ? 'border-amber-500 shadow-xl relative' : 'border-slate-200'}`}>
                {plan.popular && <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full">MOST POPULAR</div>}
                <h3 className="text-xl font-bold text-slate-900 mb-2">{plan.name}</h3>
                <div className="text-3xl font-black text-slate-900 mb-4">{plan.price}</div>
                <p className="text-slate-600 mb-5">{plan.desc}</p>
                {plan.features && plan.features.length > 0 && (
                  <ul className="space-y-2.5 mb-8 border-t border-slate-100 pt-5">
                    {plan.features.map((f, fi) => (
                      <li key={fi} className="flex items-start gap-2.5 text-sm text-slate-700">
                        <CheckCircle2 className={`w-4 h-4 mt-0.5 shrink-0 ${plan.popular ? 'text-amber-500' : 'text-emerald-500'}`} />
                        {f}
                      </li>
                    ))}
                  </ul>
                )}
                <Link href="/request-proposal" className={`block text-center py-3 rounded-xl font-bold transition-colors ${plan.popular ? 'bg-amber-500 text-white hover:bg-amber-600' : 'bg-slate-100 text-slate-900 hover:bg-slate-200'}`}>Get Started</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ServiceRelatedPosts category="Content Marketing" />
      <ServiceFAQ
        faqs={serviceData.faqs?.length ? serviceData.faqs : CONTENT_FAQS}
        headline={<>Questions About<br /><span className="text-emerald-500">Content Marketing?</span></>}
        subtext="Answers on content types, timelines, keyword research, and how we turn words into revenue."
      />
    </Layout>
  );
}

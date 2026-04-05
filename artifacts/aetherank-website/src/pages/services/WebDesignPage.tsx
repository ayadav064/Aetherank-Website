import { Layout } from "@/components/Layout";
import { FadeIn } from "@/components/ui/FadeIn";
import { usePageContent } from "@/context/CmsContext";
import { Link } from "wouter";
import { ArrowRight, CheckCircle2, Monitor, Code, Smartphone, Layers, Palette, Gauge } from "lucide-react";
import { ServiceFAQ, ServiceRelatedPosts } from "@/components/Sections";
import { useServicePageData } from "@/context/CmsContext";

const WEBDESIGN_FAQS = [
  { q: "How long does it take to design and build a website?", a: "A standard informational or service website takes 4–6 weeks from kickoff to launch. E-commerce or custom web applications typically take 8–12 weeks depending on complexity. We share a detailed timeline at the start and keep you updated at every milestone." },
  { q: "Will my website be mobile-friendly and fast?", a: "Yes — all our websites are built mobile-first and optimised for Core Web Vitals. We target a Google PageSpeed score of 90+ on both mobile and desktop. Fast, responsive websites are non-negotiable for both user experience and SEO performance." },
  { q: "Do you build on WordPress, or do you write custom code?", a: "We work with both. WordPress is ideal for content-heavy sites and clients who want to manage their own blog or pages. For high-performance, fully custom experiences we build with React and modern frameworks. We recommend the right technology for your specific needs and budget." },
  { q: "Does the website come with on-page SEO optimisation?", a: "Yes. Every website we deliver is SEO-ready: clean semantic HTML, proper heading hierarchy, optimised meta tags, schema markup, fast load times, mobile responsiveness, and an XML sitemap. This gives you a strong SEO foundation from day one." },
  { q: "What happens after the website goes live — do you offer maintenance?", a: "We offer ongoing maintenance retainers that cover security patches, plugin and CMS updates, performance monitoring, uptime alerts, regular backups, and minor content updates. We also offer dedicated support hours if you need new pages or design changes after launch." },
  { q: "Will I be able to update the website content myself?", a: "Absolutely. We build websites with a user-friendly CMS so you can update text, images, blog posts, and more without any coding knowledge. We also provide a handover session and documentation so your team feels confident managing the site independently." },
];

const WEB_BENEFIT_ICONS = [
  <Palette className="w-5 h-5" />,
  <Smartphone className="w-5 h-5" />,
  <Gauge className="w-5 h-5" />,
  <Layers className="w-5 h-5" />,
  <Code className="w-5 h-5" />,
  <CheckCircle2 className="w-5 h-5" />,
];

export default function WebDesignPage() {
  const content = usePageContent("/services/web-design-development");
  const serviceData = useServicePageData("/services/web-design-development");
  return (
    <Layout>
      <div className="bg-slate-900 pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FadeIn>
            <div className="w-16 h-16 bg-pink-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Monitor className="w-8 h-8 text-pink-500" />
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6">
              {content.headline} <span className="text-pink-500">{content.headline_highlight}</span>
            </h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-10">
              {content.subheadline}
            </p>
            <Link href="/request-proposal" className="inline-flex items-center px-8 py-4 rounded-xl bg-primary text-white font-bold text-lg hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 hover:-translate-y-1">{content.cta_text ?? "Request a Proposal"} <ArrowRight className="w-5 h-5 ml-2" /></Link>
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
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-pink-500 mb-4 shadow-sm">
                    {WEB_BENEFIT_ICONS[i % WEB_BENEFIT_ICONS.length]}
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
                    <div className="w-12 h-12 shrink-0 bg-pink-500/10 text-pink-600 font-bold rounded-full flex items-center justify-center">
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
                <div className="text-sm font-bold text-pink-500 mb-2 uppercase tracking-wide">Mini Case Study</div>
                <h3 className="text-2xl font-bold text-slate-900 mb-6">SaaS Conversion Redesign</h3>
                <div className="grid grid-cols-2 gap-6 mb-8">
                  <div className="bg-slate-50 p-4 rounded-xl text-center">
                    <div className="text-slate-500 text-sm mb-1">Before Conversion Rate</div>
                    <div className="text-xl font-bold text-slate-900">1.2%</div>
                  </div>
                  <div className="bg-pink-50 p-4 rounded-xl text-center border border-pink-100">
                    <div className="text-pink-600 text-sm mb-1">After Redesign</div>
                    <div className="text-2xl font-bold text-pink-700">4.8%</div>
                  </div>
                </div>
                <p className="text-slate-600 italic">"The new site is beautiful, fast, and most importantly, it converts. We've seen a 4x increase in signups without changing our ad spend."</p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900">Project Pricing</h2>
            <p className="text-slate-600 mt-4">One-time investments for long-term assets.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {serviceData.pricing.map((plan, i) => (
              <div key={i} className={`p-8 rounded-3xl border ${plan.popular ? 'border-pink-500 shadow-xl relative' : 'border-slate-200'}`}>
                {plan.popular && <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full">MOST POPULAR</div>}
                <h3 className="text-xl font-bold text-slate-900 mb-2">{plan.name}</h3>
                <div className="text-3xl font-black text-slate-900 mb-4">{plan.price}</div>
                <p className="text-slate-600 mb-5">{plan.desc}</p>
                {plan.features && plan.features.length > 0 && (
                  <ul className="space-y-2.5 mb-8 border-t border-slate-100 pt-5">
                    {plan.features.map((f, fi) => (
                      <li key={fi} className="flex items-start gap-2.5 text-sm text-slate-700">
                        <CheckCircle2 className={`w-4 h-4 mt-0.5 shrink-0 ${plan.popular ? 'text-pink-500' : 'text-emerald-500'}`} />
                        {f}
                      </li>
                    ))}
                  </ul>
                )}
                <Link href="/request-proposal" className={`block text-center py-3 rounded-xl font-bold transition-colors ${plan.popular ? 'bg-pink-500 text-white hover:bg-pink-600' : 'bg-slate-100 text-slate-900 hover:bg-slate-200'}`}>Get Started</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ServiceRelatedPosts category="Web Design" />
      <ServiceFAQ
        faqs={serviceData.faqs?.length ? serviceData.faqs : WEBDESIGN_FAQS}
        headline={<>Questions About<br /><span className="text-emerald-500">Web Design & Dev?</span></>}
        subtext="Everything you need to know before commissioning a new website — timelines, tech, SEO, and beyond."
      />
    </Layout>
  );
}

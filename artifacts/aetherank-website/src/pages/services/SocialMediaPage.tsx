import { Layout } from "@/components/Layout";
import { FadeIn } from "@/components/ui/FadeIn";
import { usePageContent } from "@/context/CmsContext";
import { Link } from "wouter";
import { ArrowRight, CheckCircle2, Share2, Users, Heart, MessageCircle, Image, Sparkles } from "lucide-react";
import { ServiceFAQ, ServiceRelatedPosts } from "@/components/Sections";
import { useServicePageData } from "@/context/CmsContext";

const SOCIAL_FAQS = [
  { q: "Which social media platforms do you manage?", a: "We manage Instagram, Facebook, LinkedIn, X (Twitter), YouTube, and Pinterest. Most clients start with Instagram and LinkedIn, and we recommend a platform strategy based on where your target audience actually spends time — not on every channel at once." },
  { q: "How many posts per week do you create?", a: "Our packages typically cover 3–5 posts per week per platform. This includes static graphics, carousel posts, Reels/short-form video, and story content. Every post is planned in advance and shared with you for approval before publishing." },
  { q: "Do you handle paid social advertising as well as organic?", a: "Yes. We offer integrated packages that combine organic content management with paid social campaigns (Meta Ads, LinkedIn Ads, etc.). Running paid and organic together dramatically amplifies results — your ads get warm audiences from your organic content, and your organic reach benefits from paid amplification." },
  { q: "Do you create the design and captions, or just post what we give you?", a: "We handle everything end-to-end — concept, copywriting, graphic design, video editing, scheduling, and community management (replying to comments and DMs). You simply review and approve the content calendar before anything goes live." },
  { q: "How do you measure social media ROI?", a: "Beyond vanity metrics like likes and followers, we track website traffic from social, lead form completions, story link taps, DM enquiries, and conversion events using Meta Pixel and UTM tracking. We report on metrics that connect directly to your business outcomes." },
  { q: "Can you help grow our Instagram following organically?", a: "Yes. Organic follower growth is driven by consistent high-quality content, strategic use of hashtags and keywords, Reels-first strategy, and active community engagement. While paid ads can accelerate growth, we build a sustainable organic presence that continues to deliver even without ad spend." },
];

const SOC_BENEFIT_ICONS = [
  <Users className="w-5 h-5" />,
  <Sparkles className="w-5 h-5" />,
  <MessageCircle className="w-5 h-5" />,
  <Image className="w-5 h-5" />,
  <Heart className="w-5 h-5" />,
  <CheckCircle2 className="w-5 h-5" />,
];

export default function SocialMediaPage() {
  const content = usePageContent("/services/social-media");
  const serviceData = useServicePageData("/services/social-media");
  return (
    <Layout>
      <div className="bg-slate-900 pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FadeIn>
            <div className="w-16 h-16 bg-purple-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Share2 className="w-8 h-8 text-purple-500" />
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6">
              {content.headline} <span className="text-purple-500">{content.headline_highlight}</span>
            </h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-10">
              {content.subheadline}
            </p>
            <Link href="/free-audit" className="inline-flex items-center px-8 py-4 rounded-xl bg-primary text-white font-bold text-lg hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 hover:-translate-y-1">{content.cta_text ?? "Get Free Social Audit"} <ArrowRight className="w-5 h-5 ml-2" /></Link>
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
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-purple-500 mb-4 shadow-sm">
                    {SOC_BENEFIT_ICONS[i % SOC_BENEFIT_ICONS.length]}
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
                    <div className="w-12 h-12 shrink-0 bg-purple-500/10 text-purple-600 font-bold rounded-full flex items-center justify-center">
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
                <div className="text-sm font-bold text-purple-500 mb-2 uppercase tracking-wide">Mini Case Study</div>
                <h3 className="text-2xl font-bold text-slate-900 mb-6">Real Estate Brand Growth</h3>
                <div className="grid grid-cols-2 gap-6 mb-8">
                  <div className="bg-slate-50 p-4 rounded-xl text-center">
                    <div className="text-slate-500 text-sm mb-1">Before Reach</div>
                    <div className="text-xl font-bold text-slate-900">5k / mo</div>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-xl text-center border border-purple-100">
                    <div className="text-purple-600 text-sm mb-1">After Reach (6 mo)</div>
                    <div className="text-2xl font-bold text-purple-700">125k / mo</div>
                  </div>
                </div>
                <p className="text-slate-600 italic">"The visual content they produce is stunning. Our DMs are flooded with project inquiries every time they post."</p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900">Pricing Plans</h2>
            <p className="text-slate-600 mt-4">Choose the right volume of content for your brand.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {serviceData.pricing.map((plan, i) => (
              <div key={i} className={`p-8 rounded-3xl border ${plan.popular ? 'border-purple-500 shadow-xl relative' : 'border-slate-200'}`}>
                {plan.popular && <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-purple-500 text-white text-xs font-bold px-3 py-1 rounded-full">MOST POPULAR</div>}
                <h3 className="text-xl font-bold text-slate-900 mb-2">{plan.name}</h3>
                <div className="text-3xl font-black text-slate-900 mb-4">{plan.price}</div>
                <p className="text-slate-600 mb-5">{plan.desc}</p>
                {plan.features && plan.features.length > 0 && (
                  <ul className="space-y-2.5 mb-8 border-t border-slate-100 pt-5">
                    {plan.features.map((f, fi) => (
                      <li key={fi} className="flex items-start gap-2.5 text-sm text-slate-700">
                        <CheckCircle2 className={`w-4 h-4 mt-0.5 shrink-0 ${plan.popular ? 'text-purple-500' : 'text-emerald-500'}`} />
                        {f}
                      </li>
                    ))}
                  </ul>
                )}
                <Link href="/request-proposal" className={`block text-center py-3 rounded-xl font-bold transition-colors ${plan.popular ? 'bg-purple-500 text-white hover:bg-purple-600' : 'bg-slate-100 text-slate-900 hover:bg-slate-200'}`}>Get Started</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ServiceRelatedPosts category="Social Media" />
      <ServiceFAQ
        faqs={serviceData.faqs?.length ? serviceData.faqs : SOCIAL_FAQS}
        headline={<>Questions About<br /><span className="text-emerald-500">Social Media?</span></>}
        subtext="Answers to the most common questions about our social media management and advertising services."
      />
    </Layout>
  );
}

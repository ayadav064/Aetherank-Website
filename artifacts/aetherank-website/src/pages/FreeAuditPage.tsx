import { Layout } from "@/components/Layout";
import { FadeIn } from "@/components/ui/FadeIn";
import { useState } from "react";
import {
  CheckCircle2, Search, Zap, TrendingUp, Users, Shield, ArrowRight,
  ChevronRight, Star, AlertCircle, Loader2
} from "lucide-react";
import { usePageContent } from "@/context/CmsContext";

const benefits = [
  { icon: <Search className="w-5 h-5" />, title: "Technical SEO, GEO Audit", desc: "Crawl errors, broken links, indexing issues, and site architecture problems that are costing you rankings." },
  { icon: <Zap className="w-5 h-5" />, title: "Page Speed Analysis", desc: "Core Web Vitals score, load time breakdown, and specific fixes to make your site lightning fast." },
  { icon: <TrendingUp className="w-5 h-5" />, title: "Keyword Gap Analysis", desc: "Discover high-value keywords your competitors rank for that you're missing out on." },
  { icon: <Users className="w-5 h-5" />, title: "Competitor Benchmarking", desc: "See exactly how you stack up against your top 3 competitors in search visibility and content." },
  { icon: <Shield className="w-5 h-5" />, title: "Conversion Rate Analysis", desc: "Identify UX and CRO issues on key landing pages that are causing visitors to bounce." },
  { icon: <CheckCircle2 className="w-5 h-5" />, title: "Custom Action Plan", desc: "A prioritized 30-60-90 day roadmap with specific recommendations tailored to your business." }
];

const industries = [
  "E-commerce", "Healthcare / Clinic", "Real Estate", "Education / EdTech",
  "Restaurant / Food", "SaaS / Technology", "Professional Services", "Manufacturing",
  "Travel & Tourism", "Finance / Insurance", "Other"
];

const trustBadges = [
  { icon: "🆓", text: "100% Free" },
  { icon: "💳", text: "No Credit Card" },
  { icon: "⚡", text: "48hr Delivery" },
  { icon: "🤖", text: "AI + Expert Analysis" }
];

type FormData = {
  website: string;
  businessName: string;
  industry: string;
  monthlyTraffic: string;
  goals: string[];
  name: string;
  email: string;
  phone: string;
  city: string;
};

export default function FreeAuditPage() {
  const content = usePageContent("/free-audit");
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState<FormData>({
    website: "",
    businessName: "",
    industry: "",
    monthlyTraffic: "",
    goals: [],
    name: "",
    email: "",
    phone: "",
    city: ""
  });

  const goals = ["More Leads", "More Traffic", "Better Rankings", "Brand Visibility"];

  const toggleGoal = (goal: string) => {
    setForm(f => ({
      ...f,
      goals: f.goals.includes(goal)
        ? f.goals.filter(g => g !== goal)
        : [...f.goals, goal]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "audit", ...form }),
      });
      if (!res.ok) throw new Error("Failed");
      setSubmitted(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const totalSteps = 3;

  return (
    <Layout>
      <div className="bg-white">
        {/* Hero */}
        <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pt-32 pb-20 relative overflow-hidden text-white">
          <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "radial-gradient(circle, #10b981 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <FadeIn>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/20 text-red-300 text-sm font-medium border border-red-500/30 mb-6 animate-pulse">
                <AlertCircle className="w-4 h-4" />
                ⚡ Only 10 free audits available this week — 3 spots remaining
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4 text-white">
                {content.headline}
                <br /><span className="text-emerald-400">{content.headline_highlight}</span>
              </h1>
              <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 rounded-full px-4 py-2 mb-6">
                <span className="text-emerald-300 text-sm font-medium line-through">Worth ₹15,000</span>
                <span className="text-white text-sm font-bold">Delivered FREE</span>
              </div>
              <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-8">
                {content.subheadline}
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                {trustBadges.map((badge, i) => (
                  <div key={i} className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 text-sm text-slate-200">
                    <span>{badge.icon}</span>
                    <span>{badge.text}</span>
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>
        </section>

        <section className="py-16 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-[1fr_480px] gap-12">
              {/* Benefits */}
              <FadeIn>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">What's Included in Your Audit</h2>
                  <p className="text-slate-600 mb-8">A 15+ page comprehensive report covering every critical area of your online presence.</p>
                  <div className="grid sm:grid-cols-2 gap-4 mb-10">
                    {benefits.map((b, i) => (
                      <div key={i} className="flex gap-4 bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
                        <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0">
                          {b.icon}
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-900 text-sm mb-1">{b.title}</h3>
                          <p className="text-xs text-slate-600 leading-relaxed">{b.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                    <div className="flex gap-1 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <p className="text-slate-700 text-sm italic leading-relaxed mb-4">
                      "The free audit from Aetherank was more detailed than the paid audit we got from another agency. They identified 47 technical issues we had no idea about. Within 3 months of implementing their recommendations, our organic traffic grew by 180%."
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-bold text-sm">
                        VK
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900 text-sm">Vikas Khanna</p>
                        <p className="text-slate-500 text-xs">CEO, TechNova Solutions, India</p>
                      </div>
                    </div>
                  </div>
                </div>
              </FadeIn>

              {/* Multi-step Form */}
              <FadeIn delay={0.2}>
                <div className="bg-white rounded-3xl border border-slate-100 shadow-lg p-8 sticky top-24">
                  {submitted ? (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                      </div>
                      <h3 className="text-2xl font-bold text-slate-900 mb-3">🎉 Audit Request Received!</h3>
                      <p className="text-slate-600 leading-relaxed mb-6">
                        Thank you, <strong>{form.name}</strong>! Our team has received your request.
                        You'll receive your free audit report at <strong>{form.email}</strong> within 48 hours.
                      </p>
                      <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-100 text-left">
                        <h4 className="font-semibold text-slate-900 text-sm mb-3">What happens next?</h4>
                        <div className="space-y-2 text-sm text-slate-600">
                          <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />Our team analyses your website</div>
                          <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />Report delivered in 48 hours</div>
                          <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />Strategy call booked with an expert</div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* Progress */}
                      <div className="mb-8">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-slate-700">Step {step} of {totalSteps}</span>
                          <span className="text-sm text-emerald-600 font-semibold">{Math.round((step / totalSteps) * 100)}% complete</span>
                        </div>
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                            style={{ width: `${(step / totalSteps) * 100}%` }}
                          />
                        </div>
                        <div className="flex justify-between mt-2">
                          {["Your Website", "Your Business", "Your Details"].map((label, i) => (
                            <span key={i} className={`text-xs ${i + 1 <= step ? "text-emerald-600 font-medium" : "text-slate-400"}`}>
                              {label}
                            </span>
                          ))}
                        </div>
                      </div>

                      {error && (
                        <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
                          {error}
                        </div>
                      )}

                      <form onSubmit={handleSubmit}>
                        {/* Step 1 */}
                        {step === 1 && (
                          <div className="space-y-5">
                            <div>
                              <h3 className="text-xl font-bold text-slate-900 mb-1">Your Website</h3>
                              <p className="text-sm text-slate-500 mb-6">Let's start with your website details.</p>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-1.5">Website URL *</label>
                              <input
                                required
                                type="url"
                                value={form.website}
                                onChange={e => setForm(f => ({ ...f, website: e.target.value }))}
                                placeholder="https://yourwebsite.com"
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-1.5">Business Name *</label>
                              <input
                                required
                                type="text"
                                value={form.businessName}
                                onChange={e => setForm(f => ({ ...f, businessName: e.target.value }))}
                                placeholder="Your Business Name"
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => { if (form.website && form.businessName) setStep(2); }}
                              className="w-full py-4 rounded-xl bg-emerald-500 text-white font-semibold hover:bg-emerald-600 transition-colors flex items-center justify-center gap-2"
                            >
                              Continue <ChevronRight className="w-5 h-5" />
                            </button>
                          </div>
                        )}

                        {/* Step 2 */}
                        {step === 2 && (
                          <div className="space-y-5">
                            <div>
                              <h3 className="text-xl font-bold text-slate-900 mb-1">Your Business</h3>
                              <p className="text-sm text-slate-500 mb-6">Help us tailor your audit to your industry and goals.</p>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-1.5">Industry</label>
                              <select
                                value={form.industry}
                                onChange={e => setForm(f => ({ ...f, industry: e.target.value }))}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm bg-white"
                              >
                                <option value="">Select your industry...</option>
                                {industries.map(ind => <option key={ind} value={ind}>{ind}</option>)}
                              </select>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-1.5">Approximate Monthly Traffic</label>
                              <select
                                value={form.monthlyTraffic}
                                onChange={e => setForm(f => ({ ...f, monthlyTraffic: e.target.value }))}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm bg-white"
                              >
                                <option value="">Select range...</option>
                                <option>Under 500 visitors</option>
                                <option>500 – 2,000 visitors</option>
                                <option>2,000 – 10,000 visitors</option>
                                <option>10,000+ visitors</option>
                                <option>Not sure</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-3">Main Goals (select all that apply)</label>
                              <div className="flex flex-wrap gap-2">
                                {goals.map(goal => (
                                  <button
                                    key={goal}
                                    type="button"
                                    onClick={() => toggleGoal(goal)}
                                    className={`px-4 py-2 rounded-full text-sm font-medium border-2 transition-colors ${
                                      form.goals.includes(goal)
                                        ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                                        : "border-slate-200 text-slate-600 hover:border-emerald-300"
                                    }`}
                                  >
                                    {goal}
                                  </button>
                                ))}
                              </div>
                            </div>
                            <div className="flex gap-3">
                              <button
                                type="button"
                                onClick={() => setStep(1)}
                                className="flex-1 py-3 rounded-xl border-2 border-slate-200 text-slate-600 font-semibold hover:border-slate-300 transition-colors text-sm"
                              >
                                Back
                              </button>
                              <button
                                type="button"
                                onClick={() => setStep(3)}
                                className="flex-2 flex-grow py-3 rounded-xl bg-emerald-500 text-white font-semibold hover:bg-emerald-600 transition-colors flex items-center justify-center gap-2 text-sm"
                              >
                                Continue <ChevronRight className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Step 3 */}
                        {step === 3 && (
                          <div className="space-y-5">
                            <div>
                              <h3 className="text-xl font-bold text-slate-900 mb-1">Your Contact Details</h3>
                              <p className="text-sm text-slate-500 mb-6">We'll send the audit report directly to you.</p>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name *</label>
                              <input
                                required
                                type="text"
                                value={form.name}
                                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                                placeholder="Rajesh Kumar"
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-1.5">Email Address *</label>
                              <input
                                required
                                type="email"
                                value={form.email}
                                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                                placeholder="rajesh@company.com"
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">Phone *</label>
                                <input
                                  required
                                  type="tel"
                                  value={form.phone}
                                  onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                                  placeholder="+91 98765 43210"
                                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">City</label>
                                <input
                                  type="text"
                                  value={form.city}
                                  onChange={e => setForm(f => ({ ...f, city: e.target.value }))}
                                  placeholder="Your City"
                                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
                                />
                              </div>
                            </div>
                            <div className="flex gap-3">
                              <button
                                type="button"
                                onClick={() => setStep(2)}
                                className="flex-1 py-3 rounded-xl border-2 border-slate-200 text-slate-600 font-semibold hover:border-slate-300 transition-colors text-sm"
                              >
                                Back
                              </button>
                              <button
                                type="submit"
                                disabled={submitting}
                                className="flex-2 flex-grow py-3 rounded-xl bg-emerald-500 text-white font-bold hover:bg-emerald-600 transition-colors flex items-center justify-center gap-2 text-sm disabled:opacity-60"
                              >
                                {submitting
                                  ? <><Loader2 className="w-4 h-4 animate-spin" /> Submitting...</>
                                  : <>Submit for Free Audit <ArrowRight className="w-4 h-4" /></>
                                }
                              </button>
                            </div>
                            <p className="text-xs text-slate-500 text-center">
                              🔒 Your data is 100% secure. We never share your information.
                            </p>
                          </div>
                        )}
                      </form>
                    </>
                  )}
                </div>
              </FadeIn>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}

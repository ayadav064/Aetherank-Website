import { Layout } from "@/components/Layout";
import { FadeIn } from "@/components/ui/FadeIn";
import { PageHero } from "@/components/ui/PageHero";
import { useState } from "react";
import {
  CheckCircle2, ArrowRight, Briefcase, Target, Users, TrendingUp,
  Loader2, Clock, ShieldCheck, FileText, AlertCircle
} from "lucide-react";

const services = [
  "SEO, GEO (Search Engine & Generative Engine Optimisation)",
  "PPC & Google Ads",
  "Social Media Management",
  "Website Design & Development",
  "Content Marketing",
  "Online Reputation Management",
  "Full-Service Digital Marketing"
];

const budgets = [
  "₹15,000 – ₹30,000 / month",
  "₹30,000 – ₹50,000 / month",
  "₹50,000 – ₹1,00,000 / month",
  "₹1,00,000+ / month",
  "Project-based (one-time)",
  "Not sure yet"
];

const timelines = [
  "ASAP — I need results immediately",
  "Within 1 month",
  "1–3 months",
  "Just exploring for now"
];

const perks = [
  {
    icon: Briefcase,
    color: "emerald",
    title: "Custom Strategy",
    desc: "No templated plans. Every proposal is built around your specific goals and market.",
  },
  {
    icon: Target,
    color: "blue",
    title: "Competitive Pricing",
    desc: "Transparent pricing with no hidden fees. ROI-driven packages starting from ₹15K/mo.",
  },
  {
    icon: Users,
    color: "violet",
    title: "Dedicated Team",
    desc: "Your own account manager, strategist, and campaign team — not a shared pool.",
  },
  {
    icon: TrendingUp,
    color: "amber",
    title: "Proven Results",
    desc: "Every proposal backed by our case studies and documented client success stories.",
  },
];

const included = [
  "Detailed competitive analysis of your market",
  "Channel-specific strategy (SEO, GEO, PPC, Social Media)",
  "Realistic 90-day growth projections",
  "Transparent monthly pricing breakdown",
  "Team composition and onboarding process",
  "30-min strategy call with our team",
];

const inputCls = "w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm transition-colors";

export default function RequestProposalPage() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [form, setForm] = useState({
    website: "", company: "", industry: "", budget: "", timeline: "",
    name: "", email: "", phone: "", goals: ""
  });

  const toggleService = (s: string) => {
    setSelectedServices(prev =>
      prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "proposal", ...form, services: selectedServices }),
      });
      if (!res.ok) throw new Error("Failed");
      setSubmitted(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="bg-white">
        <PageHero
          badge="Custom Proposal — Free & No Obligation"
          heading={<>Request Your <span className="text-emerald-400">Custom Proposal</span></>}
          subtext="Tell us about your business goals and we'll build a tailored digital marketing strategy with transparent pricing — delivered within 48 hours."
        />

        <section className="py-20 bg-gradient-to-b from-slate-50 to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-[1fr_540px] gap-16 items-start">

              {/* ── Left: Value column ── */}
              <FadeIn>
                <div className="space-y-10">

                  <div>
                    <h2 className="text-3xl font-bold text-slate-900 mb-3">What's in Your Proposal</h2>
                    <p className="text-slate-500 leading-relaxed">
                      A fully customised strategy document built specifically for your business — not a cookie-cutter template.
                    </p>
                  </div>

                  {/* Perks — vertical list */}
                  <div className="space-y-5">
                    {perks.map(({ icon: Icon, color, title, desc }) => (
                      <div key={title} className="flex gap-4 items-start">
                        <div className={`w-11 h-11 rounded-2xl bg-${color}-100 flex items-center justify-center flex-shrink-0`}>
                          <Icon className={`w-5 h-5 text-${color}-600`} />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 mb-1">{title}</p>
                          <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* What's Included — emerald accent card */}
                  <div className="relative rounded-2xl overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 to-emerald-700" />
                    <div
                      className="absolute inset-0 opacity-[0.06]"
                      style={{
                        backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
                        backgroundSize: "24px 24px",
                      }}
                    />
                    <div className="relative p-8">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                          <FileText className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-white">Your Proposal Will Include</h3>
                      </div>
                      <div className="space-y-3">
                        {included.map((item) => (
                          <div key={item} className="flex items-center gap-3">
                            <CheckCircle2 className="w-5 h-5 text-emerald-200 flex-shrink-0" />
                            <span className="text-emerald-50 text-sm">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Trust strip */}
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { icon: Clock, label: "48h", sub: "Turnaround" },
                      { icon: ShieldCheck, label: "Free", sub: "No Obligation" },
                      { icon: CheckCircle2, label: "100%", sub: "Custom" },
                    ].map(({ icon: Icon, label, sub }) => (
                      <div key={sub} className="bg-white border border-slate-100 rounded-xl p-3.5 text-center shadow-sm">
                        <Icon className="w-5 h-5 text-emerald-500 mx-auto mb-1.5" />
                        <p className="text-base font-bold text-slate-900 leading-none">{label}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{sub}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </FadeIn>

              {/* ── Right: Proposal Form ── */}
              <FadeIn delay={0.2}>
                <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-8 sticky top-28">
                  {submitted ? (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                      </div>
                      <h3 className="text-2xl font-bold text-slate-900 mb-3">Proposal Request Sent!</h3>
                      <p className="text-slate-500 leading-relaxed mb-6">
                        Thank you, <strong className="text-slate-800">{form.name}</strong>! We're crafting your custom proposal and will deliver it to <strong className="text-slate-800">{form.email}</strong> within 48 hours.
                      </p>
                      <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-100 text-left">
                        <h4 className="font-semibold text-slate-900 text-sm mb-3">What happens next:</h4>
                        <div className="space-y-2.5 text-sm text-slate-600">
                          {[
                            "Our strategist reviews your request",
                            "Custom proposal delivered in 48 hours",
                            "30-min strategy call scheduled",
                          ].map((step) => (
                            <div key={step} className="flex items-center gap-2">
                              <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                              {step}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="mb-7">
                        <h2 className="text-xl font-bold text-slate-900">Tell Us About Your Business</h2>
                        <p className="text-sm text-slate-500 mt-1">Fill in the details and we'll build a proposal around your goals.</p>
                      </div>

                      {error && (
                        <div className="mb-5 flex items-start gap-2.5 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
                          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                          {error}
                        </div>
                      )}

                      <form onSubmit={handleSubmit} className="space-y-5">

                        {/* Business info */}
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1.5">Website URL <span className="text-red-400">*</span></label>
                          <input
                            required type="url"
                            value={form.website}
                            onChange={e => setForm(f => ({ ...f, website: e.target.value }))}
                            placeholder="https://yourwebsite.com"
                            className={inputCls}
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Company Name <span className="text-red-400">*</span></label>
                            <input
                              required type="text"
                              value={form.company}
                              onChange={e => setForm(f => ({ ...f, company: e.target.value }))}
                              placeholder="Your Company"
                              className={inputCls}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Industry</label>
                            <input
                              type="text"
                              value={form.industry}
                              onChange={e => setForm(f => ({ ...f, industry: e.target.value }))}
                              placeholder="E.g. Healthcare"
                              className={inputCls}
                            />
                          </div>
                        </div>

                        {/* Services */}
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">Services Needed</label>
                          <div className="flex flex-wrap gap-2">
                            {services.map(s => (
                              <button
                                key={s} type="button"
                                onClick={() => toggleService(s)}
                                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                                  selectedServices.includes(s)
                                    ? "border-emerald-500 bg-emerald-500 text-white shadow-sm"
                                    : "border-slate-200 text-slate-600 bg-white hover:border-emerald-300 hover:text-emerald-700"
                                }`}
                              >
                                {s}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Monthly Budget</label>
                            <select
                              value={form.budget}
                              onChange={e => setForm(f => ({ ...f, budget: e.target.value }))}
                              className={inputCls}
                            >
                              <option value="">Select range...</option>
                              {budgets.map(b => <option key={b} value={b}>{b}</option>)}
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Timeline</label>
                            <select
                              value={form.timeline}
                              onChange={e => setForm(f => ({ ...f, timeline: e.target.value }))}
                              className={inputCls}
                            >
                              <option value="">When to start?</option>
                              {timelines.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                          </div>
                        </div>

                        {/* Contact details */}
                        <div className="border-t border-slate-100 pt-5">
                          <p className="text-sm font-semibold text-slate-800 mb-4">Your Contact Details</p>
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name <span className="text-red-400">*</span></label>
                                <input
                                  required type="text"
                                  value={form.name}
                                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                                  placeholder="Rajesh Kumar"
                                  className={inputCls}
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">Phone <span className="text-red-400">*</span></label>
                                <input
                                  required type="tel"
                                  value={form.phone}
                                  onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                                  placeholder="+91 98765 43210"
                                  className={inputCls}
                                />
                              </div>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-1.5">Email Address <span className="text-red-400">*</span></label>
                              <input
                                required type="email"
                                value={form.email}
                                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                                placeholder="rajesh@company.com"
                                className={inputCls}
                              />
                            </div>
                          </div>
                        </div>

                        <button
                          type="submit"
                          disabled={submitting}
                          className="w-full py-4 rounded-xl bg-emerald-500 text-white font-bold hover:bg-emerald-600 transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2 disabled:opacity-60 text-sm"
                        >
                          {submitting
                            ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</>
                            : <>Request Custom Proposal <ArrowRight className="w-4 h-4" /></>
                          }
                        </button>

                        <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                          100% Free & No Obligation. No spam, ever.
                        </div>
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

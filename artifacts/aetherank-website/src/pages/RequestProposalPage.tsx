import { Layout } from "@/components/Layout";
import { FadeIn } from "@/components/ui/FadeIn";
import { PageHero } from "@/components/ui/PageHero";
import { useState } from "react";
import { CheckCircle2, ArrowRight, Briefcase, Target, Users, TrendingUp, Loader2 } from "lucide-react";

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
        body: JSON.stringify({
          type: "proposal",
          ...form,
          services: selectedServices,
        }),
      });
      if (!res.ok) throw new Error("Failed");
      setSubmitted(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const perks = [
    { icon: <Briefcase className="w-5 h-5" />, title: "Custom Strategy", desc: "No templated plans. Every proposal is built around your specific goals and market." },
    { icon: <Target className="w-5 h-5" />, title: "Competitive Pricing", desc: "Transparent pricing with no hidden fees. ROI-driven packages starting from ₹15K/mo." },
    { icon: <Users className="w-5 h-5" />, title: "Dedicated Team", desc: "Your own account manager, strategist, and campaign team — not a shared pool." },
    { icon: <TrendingUp className="w-5 h-5" />, title: "Proven Results", desc: "Every proposal backed by our case studies and documented client success stories." }
  ];

  return (
    <Layout>
      <div className="bg-white">
        <PageHero
          badge="Custom Proposal — Free & No Obligation"
          heading={<>Request Your <span className="text-emerald-400">Custom Proposal</span></>}
          subtext="Tell us about your business goals and we'll build a tailored digital marketing strategy with transparent pricing — delivered within 48 hours."
        />

        <section className="py-16 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-[1fr_520px] gap-12">
              {/* Left: perks */}
              <FadeIn>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">What's in Your Proposal</h2>
                  <p className="text-slate-600 mb-8">A fully customised strategy document built specifically for your business — not a cookie-cutter template.</p>

                  <div className="grid sm:grid-cols-2 gap-4 mb-10">
                    {perks.map((p, i) => (
                      <div key={i} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                        <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
                          {p.icon}
                        </div>
                        <h3 className="font-semibold text-slate-900 mb-2">{p.title}</h3>
                        <p className="text-sm text-slate-600 leading-relaxed">{p.desc}</p>
                      </div>
                    ))}
                  </div>

                  <div className="bg-slate-900 rounded-2xl p-8 text-white">
                    <h3 className="text-xl font-bold mb-6">Your Proposal Will Include</h3>
                    <div className="space-y-3">
                      {[
                        "Detailed competitive analysis of your market",
                        "Channel-specific strategy (SEO, GEO, PPC, Social Media)",
                        "Realistic 90-day growth projections",
                        "Transparent monthly pricing breakdown",
                        "Team composition and onboarding process",
                        "30-min strategy call with our team"
                      ].map((item, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                          <span className="text-slate-300 text-sm">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </FadeIn>

              {/* Proposal Form */}
              <FadeIn delay={0.2}>
                <div className="bg-white rounded-3xl border border-slate-100 shadow-lg p-8 sticky top-24">
                  {submitted ? (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                      </div>
                      <h3 className="text-2xl font-bold text-slate-900 mb-3">Proposal Request Sent!</h3>
                      <p className="text-slate-600 leading-relaxed mb-6">
                        Thank you, <strong>{form.name}</strong>! We're working on your custom proposal.
                        Expect it in your inbox (<strong>{form.email}</strong>) within 48 hours.
                      </p>
                      <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-100 text-left">
                        <h4 className="font-semibold text-slate-900 text-sm mb-3">Next steps:</h4>
                        <div className="space-y-2 text-sm text-slate-600">
                          <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />Our strategist reviews your request</div>
                          <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />Custom proposal delivered in 48 hours</div>
                          <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />30-min strategy call scheduled</div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <>
                      <h2 className="text-xl font-bold text-slate-900 mb-6">Tell Us About Your Business</h2>
                      {error && (
                        <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
                          {error}
                        </div>
                      )}
                      <form onSubmit={handleSubmit} className="space-y-5">
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
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Company Name *</label>
                            <input
                              required
                              type="text"
                              value={form.company}
                              onChange={e => setForm(f => ({ ...f, company: e.target.value }))}
                              placeholder="Your Company"
                              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Industry</label>
                            <input
                              type="text"
                              value={form.industry}
                              onChange={e => setForm(f => ({ ...f, industry: e.target.value }))}
                              placeholder="E.g. Healthcare"
                              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">Services Needed</label>
                          <div className="flex flex-wrap gap-2">
                            {services.map(s => (
                              <button
                                key={s}
                                type="button"
                                onClick={() => toggleService(s)}
                                className={`px-3 py-1.5 rounded-full text-xs font-medium border-2 transition-colors ${
                                  selectedServices.includes(s)
                                    ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                                    : "border-slate-200 text-slate-600 hover:border-emerald-300"
                                }`}
                              >
                                {s}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1.5">Monthly Budget Range</label>
                          <select
                            value={form.budget}
                            onChange={e => setForm(f => ({ ...f, budget: e.target.value }))}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm bg-white"
                          >
                            <option value="">Select budget range...</option>
                            {budgets.map(b => <option key={b} value={b}>{b}</option>)}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1.5">Timeline</label>
                          <select
                            value={form.timeline}
                            onChange={e => setForm(f => ({ ...f, timeline: e.target.value }))}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm bg-white"
                          >
                            <option value="">When do you want to start?</option>
                            {timelines.map(t => <option key={t} value={t}>{t}</option>)}
                          </select>
                        </div>

                        <div className="border-t border-slate-100 pt-4">
                          <p className="text-sm font-semibold text-slate-700 mb-4">Your Contact Details</p>
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="block text-xs font-medium text-slate-700 mb-1.5">Full Name *</label>
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
                                <label className="block text-xs font-medium text-slate-700 mb-1.5">Phone *</label>
                                <input
                                  required
                                  type="tel"
                                  value={form.phone}
                                  onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                                  placeholder="+91 98765 43210"
                                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
                                />
                              </div>
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-slate-700 mb-1.5">Email Address *</label>
                              <input
                                required
                                type="email"
                                value={form.email}
                                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                                placeholder="rajesh@company.com"
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
                              />
                            </div>
                          </div>
                        </div>

                        <button
                          type="submit"
                          disabled={submitting}
                          className="w-full py-4 rounded-xl bg-emerald-500 text-white font-bold hover:bg-emerald-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
                        >
                          {submitting
                            ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</>
                            : <>Request Custom Proposal <ArrowRight className="w-5 h-5" /></>
                          }
                        </button>
                        <p className="text-xs text-slate-500 text-center">
                          🔒 100% Free & No Obligation. No spam, ever.
                        </p>
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

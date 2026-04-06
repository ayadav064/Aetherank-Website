import { Layout } from "@/components/Layout";
import { FadeIn } from "@/components/ui/FadeIn";
import { PageHero } from "@/components/ui/PageHero";
import { useState } from "react";
import { MapPin, Phone, Mail, Linkedin, Instagram, Facebook, CheckCircle2, Loader2, AlertCircle, ShieldCheck, Clock } from "lucide-react";

const XIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

import { useContactContent } from "@/context/CmsContext";

interface FieldErrors { [field: string]: string }

const inputCls = (err?: string) =>
  `w-full px-4 py-3 rounded-xl border ${err ? "border-red-400 bg-red-50" : "border-slate-200 bg-white"} focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm transition-colors`;

export default function ContactPage() {
  const contact = useContactContent();
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [globalError, setGlobalError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [form, setForm] = useState({
    name: "", email: "", phone: "", company: "", service: "", message: ""
  });

  const setField = (key: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setForm(f => ({ ...f, [key]: e.target.value }));
      if (fieldErrors[key]) setFieldErrors(fe => { const n = { ...fe }; delete n[key]; return n; });
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setGlobalError("");
    setFieldErrors({});

    try {
      const res = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "contact", _hp: "", ...form }),
      });

      const json = await res.json() as { ok: boolean; errors?: FieldErrors; error?: string };

      if (res.status === 429) {
        setGlobalError(json.error ?? "Too many requests. Please wait a few minutes.");
        return;
      }

      if (res.status === 422 && json.errors) {
        setFieldErrors(json.errors);
        return;
      }

      if (!res.ok || !json.ok) {
        setGlobalError(json.error ?? "Something went wrong. Please try again.");
        return;
      }

      setSubmitted(true);
    } catch {
      setGlobalError("Network error. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const services = [
    "SEO, GEO", "PPC & Google Ads", "Social Media Management",
    "Website Design & Development", "Content Marketing",
    "Online Reputation Management", "Full Digital Marketing Package"
  ];

  const addresses = [
    { label: "Headquartered in Mumbai", value: contact.address_1 },
    ...(contact.address_2 ? [{ label: "Virar Office", value: contact.address_2 }] : []),
    ...(contact.address_3 ? [{ label: "USA", value: contact.address_3 }] : []),
  ];

  return (
    <Layout>
      <div className="bg-white">
        <PageHero
          badge="Get In Touch"
          heading={<>Let's Grow Your <span className="text-emerald-400">Business Together</span></>}
          subtext="Have a project in mind? Want to discuss your marketing strategy? We'd love to hear from you."
        />

        <section className="py-20 bg-gradient-to-b from-slate-50 to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 xl:gap-16 items-start">

              {/* ── Left: Contact Info ── */}
              <FadeIn>
                <div className="space-y-10">

                  <h2 className="text-3xl font-bold text-slate-900">Get in Touch</h2>

                  {/* Contact list */}
                  <div className="space-y-8">

                    {/* Offices — all under one pin icon */}
                    <div className="flex gap-5">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-1">
                        <MapPin className="w-6 h-6 text-emerald-600" />
                      </div>
                      <div className="space-y-5">
                        {addresses.map((addr) => (
                          <div key={addr.label}>
                            <p className="font-bold text-slate-900 text-base">{addr.label}</p>
                            <p className="text-slate-500 text-sm mt-1 leading-relaxed">{addr.value}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Phone */}
                    <div className="flex gap-5 items-start">
                      <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <Phone className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 text-base">Phone</p>
                        <a
                          href={`tel:${contact.phone.replace(/\s+/g, "")}`}
                          className="text-slate-500 text-sm mt-1 block hover:text-emerald-600 transition-colors"
                        >
                          {contact.phone}
                        </a>
                      </div>
                    </div>

                    {/* Email */}
                    <div className="flex gap-5 items-start">
                      <div className="w-12 h-12 rounded-2xl bg-violet-100 flex items-center justify-center flex-shrink-0">
                        <Mail className="w-6 h-6 text-violet-600" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 text-base">Email</p>
                        <a
                          href={`mailto:${contact.email}`}
                          className="text-slate-500 text-sm mt-1 block hover:text-emerald-600 transition-colors"
                        >
                          {contact.email}
                        </a>
                      </div>
                    </div>

                    {/* Office Hours */}
                    <div className="flex gap-5 items-start">
                      <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center flex-shrink-0">
                        <Clock className="w-6 h-6 text-amber-600" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 text-base">Office Hours</p>
                        <p className="text-slate-500 text-sm mt-1">Mon–Fri, 9:30 AM – 6:30 PM</p>
                      </div>
                    </div>
                  </div>

                  {/* Social Links */}
                  {(contact.linkedin || contact.twitter || contact.instagram || contact.facebook) && (
                    <div>
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Follow Us</p>
                      <div className="flex gap-2.5">
                        {contact.linkedin && (
                          <a href={contact.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"
                            className="w-10 h-10 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all">
                            <Linkedin className="w-4.5 h-4.5" />
                          </a>
                        )}
                        {contact.twitter && (
                          <a href={contact.twitter} target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)"
                            className="w-10 h-10 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center hover:bg-black hover:text-white transition-all">
                            <XIcon className="w-4 h-4" />
                          </a>
                        )}
                        {contact.instagram && (
                          <a href={contact.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram"
                            className="w-10 h-10 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center hover:bg-pink-500 hover:text-white transition-all">
                            <Instagram className="w-4.5 h-4.5" />
                          </a>
                        )}
                        {contact.facebook && (
                          <a href={contact.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook"
                            className="w-10 h-10 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center hover:bg-blue-700 hover:text-white transition-all">
                            <Facebook className="w-4.5 h-4.5" />
                          </a>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Map */}
                  <div className="rounded-2xl overflow-hidden border border-slate-200" style={{ height: 220 }}>
                    <iframe
                      title="Aetherank Location - India"
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3773.0!2d72.8167!3d18.9667!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7ce6b3b0b0001%3A0x1!2sTardeo%20AC%20Market%2C%20Tardeo%2C%20Mumbai%2C%20Maharashtra%20400034!5e0!3m2!1sen!2sin!4v1"
                      className="w-full h-full"
                      style={{ border: 0 }}
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  </div>
                </div>
              </FadeIn>

              {/* ── Right: Contact Form ── */}
              <FadeIn delay={0.2}>
                <div className="bg-white rounded-3xl border border-slate-200 shadow-lg p-8">
                  {submitted ? (
                    <div className="h-full flex flex-col items-center justify-center text-center py-16">
                      <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mb-6">
                        <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                      </div>
                      <h3 className="text-2xl font-bold text-slate-900 mb-3">Message Sent!</h3>
                      <p className="text-slate-600 max-w-sm leading-relaxed">
                        Thanks for reaching out, <strong>{form.name}</strong>! Our team will get back to you at <strong>{form.email}</strong> within 24 hours.
                      </p>
                      <button
                        onClick={() => { setSubmitted(false); setForm({ name: "", email: "", phone: "", company: "", service: "", message: "" }); }}
                        className="mt-6 text-sm text-emerald-600 hover:underline font-medium"
                      >
                        Send another message →
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="mb-7">
                        <h2 className="text-xl font-bold text-slate-900">Send Us a Message</h2>
                        <p className="text-sm text-slate-500 mt-1">Fill in the form and we'll be in touch shortly.</p>
                      </div>

                      {globalError && (
                        <div className="mb-5 flex items-start gap-2.5 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
                          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                          {globalError}
                        </div>
                      )}

                      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                        <input type="text" name="_hp" tabIndex={-1} autoComplete="off" style={{ display: "none" }} />

                        <div className="grid sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">
                              Full Name <span className="text-red-400">*</span>
                            </label>
                            <input
                              type="text"
                              value={form.name}
                              onChange={setField("name")}
                              placeholder="Rajesh Kumar"
                              className={inputCls(fieldErrors["name"])}
                              autoComplete="name"
                            />
                            {fieldErrors["name"] && (
                              <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" />{fieldErrors["name"]}
                              </p>
                            )}
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">
                              Email Address <span className="text-red-400">*</span>
                            </label>
                            <input
                              type="email"
                              value={form.email}
                              onChange={setField("email")}
                              placeholder="rajesh@company.com"
                              className={inputCls(fieldErrors["email"])}
                              autoComplete="email"
                            />
                            {fieldErrors["email"] && (
                              <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" />{fieldErrors["email"]}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Phone Number</label>
                            <input
                              type="tel"
                              value={form.phone}
                              onChange={setField("phone")}
                              placeholder="+91 98765 43210"
                              className={inputCls(fieldErrors["phone"])}
                              autoComplete="tel"
                            />
                            {fieldErrors["phone"] && (
                              <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" />{fieldErrors["phone"]}
                              </p>
                            )}
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Company Name</label>
                            <input
                              type="text"
                              value={form.company}
                              onChange={setField("company")}
                              placeholder="Your Company"
                              className={inputCls(fieldErrors["company"])}
                              autoComplete="organization"
                            />
                            {fieldErrors["company"] && (
                              <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" />{fieldErrors["company"]}
                              </p>
                            )}
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1.5">Service Interested In</label>
                          <select
                            value={form.service}
                            onChange={setField("service")}
                            className={inputCls(fieldErrors["service"]) + " bg-white"}
                          >
                            <option value="">Select a service...</option>
                            {services.map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1.5">
                            Message <span className="text-red-400">*</span>
                          </label>
                          <textarea
                            rows={4}
                            value={form.message}
                            onChange={setField("message")}
                            placeholder="Tell us about your business and what you're looking to achieve..."
                            className={inputCls(fieldErrors["message"]) + " resize-none"}
                          />
                          {fieldErrors["message"] && (
                            <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                              <AlertCircle className="w-3 h-3" />{fieldErrors["message"]}
                            </p>
                          )}
                          <p className="text-xs text-slate-400 mt-1 text-right">{form.message.length}/3000</p>
                        </div>

                        <button
                          type="submit"
                          disabled={submitting}
                          className="w-full py-4 rounded-xl bg-emerald-500 text-white font-semibold hover:bg-emerald-600 transition-colors text-sm disabled:opacity-60 flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
                        >
                          {submitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</> : "Send Message →"}
                        </button>

                        <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                          We respond within 24 hours. Your information is 100% secure.
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

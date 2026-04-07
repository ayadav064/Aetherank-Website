/**
 * Smart form submission:
 * 1. Tries the API backend (/api/submissions) first
 * 2. If API is unavailable (e.g. Netlify static deploy), falls back to Netlify Forms
 *
 * Netlify Forms stores submissions in the Netlify dashboard (100/month free).
 * Form names must match the forms defined in /public/netlify-forms.html
 *
 * VITE_API_BASE_URL: when set (e.g. https://your-backend.up.railway.app),
 * submission calls go directly to the Railway backend instead of relative /api.
 */

const API_BASE: string = (import.meta as unknown as { env: Record<string, string> }).env.VITE_API_BASE_URL ?? "";

function encodeNetlifyForm(data: Record<string, string>): string {
  return Object.entries(data)
    .map(([key, val]) => `${encodeURIComponent(key)}=${encodeURIComponent(val)}`)
    .join("&");
}

async function submitToNetlify(formName: string, data: Record<string, string>): Promise<void> {
  const payload = encodeNetlifyForm({ "form-name": formName, ...data });
  const res = await fetch("/", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: payload,
  });
  if (!res.ok) throw new Error("Netlify form submission failed");
}

export interface SubmitResult {
  ok: boolean;
  errors?: Record<string, string>;
  error?: string;
}

/** Contact form */
export async function submitContactForm(data: {
  name: string;
  email: string;
  phone: string;
  company: string;
  service: string;
  message: string;
}): Promise<SubmitResult> {
  try {
    const res = await fetch(`${API_BASE}/api/submissions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "contact", _hp: "", ...data }),
    });

    if (res.status === 429) {
      const j = await res.json() as { error?: string };
      return { ok: false, error: j.error ?? "Too many requests. Please wait a few minutes." };
    }
    if (res.status === 422) {
      const j = await res.json() as { errors?: Record<string, string> };
      return { ok: false, errors: j.errors };
    }
    if (res.ok) {
      const j = await res.json() as { ok: boolean };
      if (j.ok) return { ok: true };
    }
    throw new Error("API error");
  } catch {
    await submitToNetlify("contact", {
      name: data.name,
      email: data.email,
      phone: data.phone,
      company: data.company,
      service: data.service,
      message: data.message,
    });
    return { ok: true };
  }
}

/** Free Audit form */
export async function submitAuditForm(data: {
  name: string;
  email: string;
  phone: string;
  city?: string;
  website: string;
  businessName: string;
  industry: string;
  monthlyTraffic: string;
  goals: string[];
}): Promise<SubmitResult> {
  try {
    const res = await fetch(`${API_BASE}/api/submissions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "audit", ...data }),
    });
    if (!res.ok) throw new Error("API error");
    return { ok: true };
  } catch {
    await submitToNetlify("free-audit", {
      name: data.name,
      email: data.email,
      phone: data.phone,
      city: data.city ?? "",
      website: data.website,
      businessName: data.businessName,
      industry: data.industry,
      monthlyTraffic: data.monthlyTraffic,
      goals: data.goals.join(", "),
    });
    return { ok: true };
  }
}

/** Request Proposal form */
export async function submitProposalForm(data: {
  name: string;
  email: string;
  phone: string;
  company: string;
  website: string;
  industry: string;
  services: string[];
  budget: string;
  timeline: string;
}): Promise<SubmitResult> {
  try {
    const res = await fetch(`${API_BASE}/api/submissions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "proposal", ...data }),
    });
    if (!res.ok) throw new Error("API error");
    return { ok: true };
  } catch {
    await submitToNetlify("request-proposal", {
      name: data.name,
      email: data.email,
      phone: data.phone,
      company: data.company,
      website: data.website,
      industry: data.industry,
      services: data.services.join(", "),
      budget: data.budget,
      timeline: data.timeline,
    });
    return { ok: true };
  }
}

/** Newsletter subscribe */
export async function submitNewsletterSubscribe(email: string): Promise<{ ok: boolean; message?: string; error?: string }> {
  try {
    const res = await fetch(`${API_BASE}/api/newsletter/subscribe`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await res.json() as { success?: boolean; message?: string; error?: string };
    if (res.ok && data.success) return { ok: true, message: data.message ?? "You've been subscribed!" };
    if (res.status === 429) return { ok: false, error: data.error ?? "Too many requests. Please try again later." };
    throw new Error(data.error ?? "API error");
  } catch {
    await submitToNetlify("newsletter", { email });
    return { ok: true, message: "You've been subscribed!" };
  }
}

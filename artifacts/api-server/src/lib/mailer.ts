import nodemailer from "nodemailer";
import { logger } from "./logger";

interface MailOptions {
  to: string;
  subject: string;
  html: string;
}

function createTransport() {
  const host = process.env["SMTP_HOST"];
  const port = parseInt(process.env["SMTP_PORT"] ?? "587");
  const user = process.env["SMTP_USER"];
  const pass = process.env["SMTP_PASS"];

  if (!host || !user || !pass) return null;

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
}

export async function sendMail(opts: MailOptions): Promise<boolean> {
  try {
    const transport = createTransport();
    if (!transport) {
      logger.warn("SMTP not configured — email not sent");
      return false;
    }
    const from = process.env["SMTP_FROM"] ?? process.env["SMTP_USER"] ?? "noreply@aetherank.com";
    await transport.sendMail({ from, ...opts });
    logger.info({ to: opts.to, subject: opts.subject }, "Email sent");
    return true;
  } catch (err) {
    logger.error({ err }, "Failed to send email");
    return false;
  }
}

export function isMailConfigured(): boolean {
  return !!(process.env["SMTP_HOST"] && process.env["SMTP_USER"] && process.env["SMTP_PASS"]);
}

export function buildSubmissionEmail(type: string, data: Record<string, unknown>): string {
  const label = type === "contact" ? "Contact Form" : type === "audit" ? "Free Audit Request" : "Proposal Request";
  const rows = Object.entries(data)
    .filter(([k]) => k !== "_hp")
    .map(([k, v]) => {
      const val = Array.isArray(v) ? v.join(", ") : String(v ?? "");
      return `<tr><td style="padding:6px 12px;font-weight:600;color:#1d2327;white-space:nowrap;border-bottom:1px solid #f0f0f1">${k}</td><td style="padding:6px 12px;color:#646970;border-bottom:1px solid #f0f0f1">${val}</td></tr>`;
    })
    .join("");

  return `
    <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:600px;margin:0 auto">
      <div style="background:#1d2327;padding:24px 32px;border-radius:12px 12px 0 0">
        <div style="display:flex;align-items:center;gap:12px">
          <div style="width:36px;height:36px;border-radius:8px;background:#10b981;display:inline-flex;align-items:center;justify-content:center;font-weight:900;color:#000;font-size:14px">A</div>
          <span style="color:#fff;font-size:18px;font-weight:700">Aetherank CMS</span>
        </div>
      </div>
      <div style="background:#fff;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 12px 12px;padding:32px">
        <h2 style="margin:0 0 8px;color:#1d2327;font-size:20px">New ${label} Submission</h2>
        <p style="margin:0 0 24px;color:#646970;font-size:14px">A new submission was received on your website.</p>
        <table style="width:100%;border-collapse:collapse;border-radius:8px;overflow:hidden;border:1px solid #f0f0f1">
          ${rows}
        </table>
        <div style="margin-top:24px;padding-top:24px;border-top:1px solid #f0f0f1">
          <a href="${process.env["SITE_URL"] ?? "https://aetherank.com"}/admin/submissions" style="display:inline-block;background:#2271b1;color:#fff;text-decoration:none;padding:10px 20px;border-radius:6px;font-size:14px;font-weight:600">View in Admin →</a>
        </div>
        <p style="margin:16px 0 0;color:#a7aaad;font-size:12px">This is an automated notification from Aetherank CMS.</p>
      </div>
    </div>
  `;
}

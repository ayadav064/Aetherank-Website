import { Layout } from "@/components/Layout";
import { FadeIn } from "@/components/ui/FadeIn";
import { useCms } from "@/context/CmsContext";

const STATIC_CONTENT = `
<section><h2>1. Introduction</h2>
<p>Aetherank ("we", "our", or "us") is committed to protecting your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your data when you visit our website <strong>aetherank.com</strong> or engage with our digital marketing services.</p>
<p>By using our website or services, you agree to the terms described in this policy. If you do not agree, please discontinue use of our website.</p></section>

<section><h2>2. Information We Collect</h2>
<p>We may collect the following types of information:</p>
<ul>
<li><strong>Personal Identification Information:</strong> Name, email address, phone number, company name — provided when you fill out forms, request a proposal, or contact us.</li>
<li><strong>Usage Data:</strong> Pages visited, time spent, browser type, IP address, and referring URLs collected automatically via cookies and analytics tools.</li>
<li><strong>Business Information:</strong> Details about your business, goals, and existing digital marketing setup shared during consultations or onboarding.</li>
<li><strong>Payment Information:</strong> Billing details processed securely through third-party payment providers. We do not store card details on our servers.</li>
</ul></section>

<section><h2>3. How We Use Your Information</h2>
<p>We use collected information to:</p>
<ul>
<li>Respond to inquiries and deliver requested services</li>
<li>Send proposals, reports, and service-related communications</li>
<li>Improve our website and tailor our content to your interests</li>
<li>Send marketing communications (you may opt out at any time)</li>
<li>Comply with legal obligations and prevent fraudulent activity</li>
</ul></section>

<section><h2>4. Cookies &amp; Tracking Technologies</h2>
<p>We use cookies and similar tracking technologies to enhance your browsing experience and gather analytics data. These include session cookies, persistent cookies, and third-party cookies from tools such as Google Analytics, Meta Pixel, and HubSpot.</p>
<p>You can control cookie preferences through your browser settings. Disabling cookies may affect website functionality.</p></section>

<section><h2>5. Sharing of Information</h2>
<p>We do not sell your personal data. We may share information with:</p>
<ul>
<li><strong>Service Providers:</strong> Trusted third-party vendors who assist in delivering our services (e.g., email platforms, CRM tools, payment processors).</li>
<li><strong>Legal Authorities:</strong> When required by law, court order, or government regulation.</li>
<li><strong>Business Transfers:</strong> In the event of a merger, acquisition, or sale of assets, your data may be transferred to the successor entity.</li>
</ul></section>

<section><h2>6. Data Security</h2>
<p>We implement industry-standard security measures including SSL encryption, access controls, and secure data storage to protect your information. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.</p></section>

<section><h2>7. Your Rights</h2>
<p>You have the right to:</p>
<ul>
<li>Access the personal data we hold about you</li>
<li>Request correction of inaccurate data</li>
<li>Request deletion of your data (subject to legal retention requirements)</li>
<li>Opt out of marketing communications at any time</li>
<li>Lodge a complaint with a relevant data protection authority</li>
</ul>
<p>To exercise any of these rights, email us at <a href="mailto:help@aetherank.com">help@aetherank.com</a>.</p></section>

<section><h2>8. Third-Party Links</h2>
<p>Our website may contain links to third-party sites. We are not responsible for the privacy practices or content of those websites and encourage you to review their privacy policies separately.</p></section>

<section><h2>9. Children's Privacy</h2>
<p>Our services are not directed to individuals under the age of 18. We do not knowingly collect personal information from minors. If you believe we have inadvertently collected such information, please contact us immediately.</p></section>

<section><h2>10. Changes to This Policy</h2>
<p>We may update this Privacy Policy from time to time. Changes will be posted on this page with a revised "Last updated" date. Continued use of our website after changes constitutes acceptance of the updated policy.</p></section>

<section><h2>11. Contact Us</h2>
<p>If you have any questions about this Privacy Policy, please reach out:</p>
<p><strong>Aetherank Digital Marketing Agency</strong><br/>Tardeo AC Market, Mumbai — 400034, India<br/>Email: <a href="mailto:help@aetherank.com">help@aetherank.com</a><br/>Phone: <a href="tel:+918010960269">+91 80109 60269</a></p></section>
`;

export default function PrivacyPolicyPage() {
  const { settings } = useCms();
  const html = settings.content.privacy_html ?? "";

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
        <FadeIn>
          <h1 className="text-4xl font-black text-slate-900 mb-3">Privacy Policy</h1>
          <p className="text-sm text-slate-400 mb-10">Last updated: March 29, 2026</p>
        </FadeIn>

        <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed">
          {html ? (
            <div dangerouslySetInnerHTML={{ __html: html }} />
          ) : (
            <div dangerouslySetInnerHTML={{ __html: STATIC_CONTENT }} />
          )}
        </div>
      </div>
    </Layout>
  );
}

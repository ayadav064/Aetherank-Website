import { Layout } from "@/components/Layout";
import { FadeIn } from "@/components/ui/FadeIn";
import { useCms } from "@/context/CmsContext";

const STATIC_CONTENT = `
<section><h2>1. Acceptance of Terms</h2>
<p>By accessing or using the website <strong>aetherank.com</strong> or any services provided by Aetherank ("we", "our", "us"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our website or engage our services.</p></section>

<section><h2>2. Services</h2>
<p>Aetherank provides digital marketing services including but not limited to SEO &amp; GEO Optimization, Pay-Per-Click (PPC) Advertising, Social Media Management, Web Design &amp; Development, Content Marketing, and Online Reputation Management.</p>
<p>The scope, deliverables, timelines, and pricing of services are defined in individual service agreements or proposals provided to each client. These Terms of Service apply in conjunction with any such agreements.</p></section>

<section><h2>3. Client Responsibilities</h2>
<p>As a client or website visitor, you agree to:</p>
<ul>
<li>Provide accurate and complete information when engaging our services</li>
<li>Cooperate in a timely manner with requests for content, credentials, approvals, and feedback</li>
<li>Not use our services for unlawful, deceptive, or harmful purposes</li>
<li>Not attempt to reverse-engineer, copy, or resell our proprietary methodologies or reports</li>
<li>Maintain confidentiality of login credentials and account access provided by Aetherank</li>
</ul></section>

<section><h2>4. Payment Terms</h2>
<p>Fees for services are outlined in the applicable proposal or service agreement. Unless otherwise agreed:</p>
<ul>
<li>Invoices are due within 7 days of issuance</li>
<li>Late payments may attract interest at 1.5% per month</li>
<li>We reserve the right to suspend services if payments are overdue by more than 15 days</li>
<li>All fees are exclusive of applicable taxes (GST or otherwise)</li>
</ul></section>

<section><h2>5. Intellectual Property</h2>
<p>All content, branding, designs, code, and materials on this website are the intellectual property of Aetherank unless otherwise stated. You may not reproduce, distribute, or create derivative works without our express written permission.</p>
<p>Content and deliverables created specifically for a client as part of a paid engagement become the client's property upon full payment, unless stated otherwise in the service agreement.</p></section>

<section><h2>6. Confidentiality</h2>
<p>Both parties agree to keep confidential any proprietary information, strategies, or business data shared during the engagement. This obligation survives the termination of the service agreement.</p></section>

<section><h2>7. Results Disclaimer</h2>
<p>While we are committed to delivering measurable results, digital marketing outcomes depend on a range of factors including industry competition, algorithm changes, client cooperation, and market conditions. Aetherank does not guarantee specific rankings, traffic volumes, leads, or revenue figures unless explicitly stated in a written agreement.</p></section>

<section><h2>8. Limitation of Liability</h2>
<p>To the maximum extent permitted by law, Aetherank shall not be liable for any indirect, incidental, special, or consequential damages arising from the use of our services or website. Our total liability in any circumstance shall not exceed the amount paid by the client for the specific service in question during the three months preceding the claim.</p></section>

<section><h2>9. Termination</h2>
<p>Either party may terminate a service engagement with 30 days' written notice unless otherwise specified in the service agreement. Upon termination, the client is responsible for payment of all work completed up to the termination date. Aetherank reserves the right to terminate services immediately in cases of non-payment or breach of these terms.</p></section>

<section><h2>10. Governing Law</h2>
<p>These Terms of Service are governed by the laws of India. Any disputes arising out of or related to these terms or our services shall be subject to the exclusive jurisdiction of the courts in Mumbai, Maharashtra, India.</p></section>

<section><h2>11. Changes to Terms</h2>
<p>We may update these Terms of Service at any time. Updated terms will be posted on this page with a revised date. Continued use of our website or services after changes are posted constitutes your acceptance of the revised terms.</p></section>

<section><h2>12. Contact Us</h2>
<p>For questions about these Terms, please contact:</p>
<p><strong>Aetherank Digital Marketing Agency</strong><br/>Tardeo AC Market, Mumbai — 400034, India<br/>Email: <a href="mailto:help@aetherank.com">help@aetherank.com</a><br/>Phone: <a href="tel:+918010960269">+91 80109 60269</a></p></section>
`;

export default function TermsOfServicePage() {
  const { settings } = useCms();
  const html = settings.content.terms_html ?? "";

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
        <FadeIn>
          <h1 className="text-4xl font-black text-slate-900 mb-3">Terms of Service</h1>
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

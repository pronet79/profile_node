import Seo from '../components/Seo.jsx';

/* Reusable shell for the three static legal pages. */
export function LegalPage({ title, path, children }) {
  return (
    <div className="py-20">
      <Seo title={`${title} — Pradosh Mukherjee`} path={path} noindex />
      <div className="container-x max-w-3xl">
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        <div className="mt-6 space-y-4 leading-relaxed text-slate-400">{children}</div>
        <p className="mt-10 text-xs text-slate-600">
          This page is a template and does not constitute legal advice. Have it reviewed for your jurisdiction before publishing.
        </p>
      </div>
    </div>
  );
}

export function Privacy() {
  return (
    <LegalPage title="Privacy Policy" path="/privacy">
      <p>This website collects only the information you choose to submit through its contact, feedback and support forms — such as your name, email and message.</p>
      <p>Submitted data is stored securely and used solely to respond to your inquiry, review feedback, or process a voluntary support payment. It is not sold or shared for advertising.</p>
      <p>Payment processing is handled by a third-party gateway; no card or UPI credentials are ever stored on this site.</p>
      <p>To request access to or deletion of your data, contact the email listed in the footer.</p>
    </LegalPage>
  );
}

export function Terms() {
  return (
    <LegalPage title="Terms of Use" path="/terms">
      <p>By using this website you agree to use it lawfully and not to attempt to disrupt or gain unauthorized access to its systems.</p>
      <p>All content, code samples and project descriptions are provided for informational purposes. Project engagements are governed by separate written agreements.</p>
      <p>The site is provided "as is" without warranties of any kind to the extent permitted by law.</p>
    </LegalPage>
  );
}

export function PaymentPolicy() {
  return (
    <LegalPage title="Payment & Refund Policy" path="/payment-policy">
      <p><strong>Support payments are voluntary.</strong> Tips made through the "Support My Work" section are optional contributions and do not purchase any product or service.</p>
      <p>Because contributions are voluntary and non-transactional, they are generally non-refundable. If a payment was made in error, contact the email in the footer within 7 days and a refund will be considered case by case.</p>
      <p>All payments are processed and verified through a secure third-party gateway. No sensitive payment credentials are stored on this website.</p>
      <p>For any payment question, reach out via the contact details in the footer.</p>
    </LegalPage>
  );
}

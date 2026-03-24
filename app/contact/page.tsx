import type { Metadata } from "next";
import { submitInquiryAction } from "@/app/actions";

type ContactPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Send press, business, creator, or general inquiries to Snap Critique by Studio 198.",
};

export default async function ContactPage({ searchParams }: ContactPageProps) {
  const params = await searchParams;
  const success = typeof params.success === "string" ? params.success : "";
  const error = typeof params.error === "string" ? params.error : "";

  return (
    <div className="page-stack">
      <section className="contact-shell">
        <p className="eyebrow">Contact / Submission</p>
        <h1>Reach Studio 198</h1>
        <p>
          Use this form for press, partnerships, review requests, creator
          submissions, or general questions. Messages are stored in the admin
          panel for follow-up.
        </p>

        {success ? <p className="muted-note">{success}</p> : null}
        {error ? <p className="muted-note">{error}</p> : null}

        <form action={submitInquiryAction} className="contact-form">
          <div className="field">
            <label htmlFor="name">Name</label>
            <input id="name" name="name" required />
          </div>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" required />
          </div>
          <div className="field-full">
            <label htmlFor="subject">Subject</label>
            <input id="subject" name="subject" placeholder="Press, business, creator submission" />
          </div>
          <div className="field-full">
            <label htmlFor="message">Message</label>
            <textarea id="message" name="message" required />
          </div>
          <div className="field-full">
            <button type="submit" className="button-primary">
              Send Message
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

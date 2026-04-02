import { subscribeNewsletterAction } from "@/app/actions";

const newsletterMessages: Record<string, string> = {
  success: "You’re in. Your email is saved and entered for the next monthly draw.",
  exists: "That email is already subscribed and still entered in the giveaway.",
  invalid: "Enter a valid email address to join the giveaway.",
};

type NewsletterBlockProps = {
  state?: string;
};

export default function NewsletterBlock({ state = "" }: NewsletterBlockProps) {
  const message = newsletterMessages[state] ?? "";

  return (
    <section className="newsletter-block" id="newsletter">
      <div className="newsletter-inner">
        <p className="eyebrow">Monthly Entry</p>
        <h2>SNAP CRITIQUE GIVEAWAY</h2>
        <p className="sub">Every month:</p>

        <p className="offer">
          <strong>$50 AMC Gift Card</strong>
        </p>

        <p className="fine">
          Enter your email to join the newsletter and get automatically entered.
        </p>
        <p className="fine">No fluff. Just movies.</p>

        <form className="newsletter-form" action={subscribeNewsletterAction}>
          <label className="newsletter-label" htmlFor="newsletter-email">
            Email address
          </label>
          <input
            id="newsletter-email"
            name="email"
            type="email"
            placeholder="Enter your email"
            autoComplete="email"
            required
          />
          <button type="submit" className="button-primary">
            Enter
          </button>
        </form>

        {message ? <p className="newsletter-feedback">{message}</p> : null}
      </div>
    </section>
  );
}

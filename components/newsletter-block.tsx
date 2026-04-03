"use client";

import { useActionState, useEffect, useMemo, useRef } from "react";
import { useFormStatus } from "react-dom";
import {
  subscribeNewsletterAction,
  type NewsletterActionState,
} from "@/app/actions";

const newsletterMessages: Record<string, string> = {
  success: "You’re in. Your email is saved and entered for the next monthly draw.",
  exists: "That email is already subscribed and still entered in the giveaway.",
  invalid: "Enter a valid email address to join the giveaway.",
  error: "We couldn’t save your entry right now. Please try again in a moment.",
};

type NewsletterBlockProps = {
  state?: string;
};

const idleNewsletterState: NewsletterActionState = {
  status: "idle",
  message: "",
};

function NewsletterSubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      className="button-primary newsletter-submit"
      disabled={pending}
      aria-disabled={pending}
    >
      {pending ? "Entering..." : "Enter"}
    </button>
  );
}

export default function NewsletterBlock({ state = "" }: NewsletterBlockProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const initialState = useMemo<NewsletterActionState>(() => {
    const message = newsletterMessages[state] ?? "";

    if (!message) {
      return idleNewsletterState;
    }

    return {
      status: state as NewsletterActionState["status"],
      message,
    };
  }, [state]);
  const [formState, formAction] = useActionState(
    subscribeNewsletterAction,
    initialState,
  );

  useEffect(() => {
    if (formState.status === "success") {
      formRef.current?.reset();
    }
  }, [formState.status]);

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

        <form className="newsletter-form" action={formAction} ref={formRef}>
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
          <NewsletterSubmitButton />
        </form>

        {formState.message ? (
          <p
            className={`newsletter-feedback newsletter-feedback--${formState.status}`}
            role="status"
            aria-live="polite"
          >
            {formState.message}
          </p>
        ) : null}
      </div>
    </section>
  );
}

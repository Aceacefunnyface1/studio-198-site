"use client";

import { useState } from "react";

type ShareActionsProps = {
  title: string;
  path: string;
};

export function ShareActions({ title, path }: ShareActionsProps) {
  const [copied, setCopied] = useState(false);
  const shareUrl =
    typeof window === "undefined"
      ? path
      : `${window.location.origin}${path}`;

  async function handleCopy() {
    if (typeof window === "undefined") {
      return;
    }

    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  }

  const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    `${title} on Snap Critique`,
  )}&url=${encodeURIComponent(shareUrl)}`;

  const mailUrl = `mailto:?subject=${encodeURIComponent(
    `${title} | Snap Critique`,
  )}&body=${encodeURIComponent(shareUrl)}`;

  return (
    <div className="inline-actions">
      <button type="button" className="button-link" onClick={handleCopy}>
        {copied ? "Link Copied" : "Copy Link"}
      </button>
      <a className="button-secondary" href={tweetUrl} target="_blank" rel="noreferrer">
        Share on X
      </a>
      <a className="button-secondary" href={mailUrl}>
        Email
      </a>
    </div>
  );
}

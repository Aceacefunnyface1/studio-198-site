"use client";

import { useState } from "react";

type ShareActionsProps = {
  title: string;
  path: string;
};

export function ShareActions({ title, path }: ShareActionsProps) {
  const [copied, setCopied] = useState(false);
  const origin = typeof window === "undefined" ? "" : window.location.origin;
  const nativeShareSupported =
    typeof navigator !== "undefined" && typeof navigator.share === "function";
  const shareUrl = origin ? `${origin}${path}` : path;
  const shareText = `${title} on Snap Critique`;

  async function handleCopy() {
    if (typeof window === "undefined") {
      return;
    }

    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(shareUrl);
    } else {
      window.prompt("Copy this review link:", shareUrl);
    }

    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  }

  async function handleNativeShare() {
    if (!nativeShareSupported || typeof navigator.share !== "function") {
      return;
    }

    await navigator.share({
      title,
      text: shareText,
      url: shareUrl,
    });
  }

  const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    shareText,
  )}&url=${encodeURIComponent(shareUrl)}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
  const redditUrl = `https://www.reddit.com/submit?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(shareText)}`;
  const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;

  const mailUrl = `mailto:?subject=${encodeURIComponent(
    `${title} | Snap Critique`,
  )}&body=${encodeURIComponent(`${shareText}\n\n${shareUrl}`)}`;

  return (
    <div className="share-actions">
      <button type="button" className="button-link share-action-button" onClick={handleCopy}>
        {copied ? "Link Copied" : "Copy Link"}
      </button>
      {nativeShareSupported ? (
        <button
          type="button"
          className="button-secondary share-action-button"
          onClick={handleNativeShare}
        >
          Share
        </button>
      ) : null}
      <a className="button-secondary share-action-button" href={tweetUrl} target="_blank" rel="noreferrer">
        Share on X
      </a>
      <a className="button-secondary share-action-button" href={facebookUrl} target="_blank" rel="noreferrer">
        Facebook
      </a>
      <a className="button-secondary share-action-button" href={mailUrl}>
        Share by Email
      </a>
      <a className="button-secondary share-action-button" href={redditUrl} target="_blank" rel="noreferrer">
        Reddit
      </a>
      <a className="button-secondary share-action-button" href={linkedInUrl} target="_blank" rel="noreferrer">
        LinkedIn
      </a>
    </div>
  );
}

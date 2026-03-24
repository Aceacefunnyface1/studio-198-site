import type { Metadata } from "next";
import {
  deleteCommentAction,
  deleteReviewAction,
  loginAction,
  logoutAction,
  saveReviewAction,
  toggleCommentVisibilityAction,
} from "@/app/actions";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { readSiteData } from "@/lib/site-data";
import { verdictOptions } from "@/lib/types";
import { formatDate } from "@/lib/utils";

type AdminPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export const metadata: Metadata = {
  title: "Admin",
  description:
    "Manage reviews, comments, poster uploads, and incoming contact messages for Snap Critique.",
};

function ReviewForm({
  review,
}: {
  review?: Awaited<ReturnType<typeof readSiteData>>["reviews"][number];
}) {
  const isEditing = Boolean(review);

  return (
    <form
      action={saveReviewAction}
      className="review-form"
      encType="multipart/form-data"
    >
      <input type="hidden" name="id" value={review?.id ?? ""} />
      <div className="field">
        <label htmlFor={`movieTitle-${review?.id ?? "new"}`}>Movie Title</label>
        <input
          id={`movieTitle-${review?.id ?? "new"}`}
          name="movieTitle"
          defaultValue={review?.movieTitle ?? ""}
          required
        />
      </div>
      <div className="field">
        <label htmlFor={`slug-${review?.id ?? "new"}`}>Slug</label>
        <input
          id={`slug-${review?.id ?? "new"}`}
          name="slug"
          defaultValue={review?.slug ?? ""}
          placeholder="leave blank to auto-generate"
        />
      </div>
      <div className="field">
        <label htmlFor={`releaseYear-${review?.id ?? "new"}`}>Release Year</label>
        <input
          id={`releaseYear-${review?.id ?? "new"}`}
          name="releaseYear"
          defaultValue={review?.releaseYear ?? ""}
          inputMode="numeric"
        />
      </div>
      <div className="field">
        <label htmlFor={`rating-${review?.id ?? "new"}`}>Rating</label>
        <input
          id={`rating-${review?.id ?? "new"}`}
          name="rating"
          defaultValue={review?.rating ?? ""}
          placeholder="0 to 5"
          inputMode="decimal"
        />
      </div>
      <div className="field">
        <label htmlFor={`verdict-${review?.id ?? "new"}`}>Verdict</label>
        <select
          id={`verdict-${review?.id ?? "new"}`}
          name="verdict"
          defaultValue={review?.verdict ?? "WATCH"}
        >
          {verdictOptions.map((verdict) => (
            <option key={verdict} value={verdict}>
              {verdict}
            </option>
          ))}
        </select>
      </div>
      <div className="field">
        <label htmlFor={`status-${review?.id ?? "new"}`}>Status</label>
        <select
          id={`status-${review?.id ?? "new"}`}
          name="status"
          defaultValue={review?.status ?? "published"}
        >
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>
      </div>
      <div className="field">
        <label htmlFor={`reviewer-${review?.id ?? "new"}`}>Reviewer Name</label>
        <input
          id={`reviewer-${review?.id ?? "new"}`}
          name="reviewerName"
          defaultValue={review?.reviewerName ?? "Ace Verdict"}
        />
      </div>
      <div className="field">
        <label htmlFor={`director-${review?.id ?? "new"}`}>Director</label>
        <input
          id={`director-${review?.id ?? "new"}`}
          name="director"
          defaultValue={review?.director ?? ""}
        />
      </div>
      <div className="field">
        <label htmlFor={`runtime-${review?.id ?? "new"}`}>Runtime</label>
        <input
          id={`runtime-${review?.id ?? "new"}`}
          name="runtime"
          defaultValue={review?.runtime ?? ""}
          placeholder="142 min"
        />
      </div>
      <div className="field">
        <label htmlFor={`posterImage-${review?.id ?? "new"}`}>Poster URL</label>
        <input
          id={`posterImage-${review?.id ?? "new"}`}
          name="posterImage"
          defaultValue={review?.posterImage ?? ""}
          placeholder="/uploads/my-poster.jpg"
        />
      </div>
      <div className="field">
        <label htmlFor={`posterFile-${review?.id ?? "new"}`}>Poster Upload</label>
        <input id={`posterFile-${review?.id ?? "new"}`} name="posterFile" type="file" accept="image/*" />
      </div>
      <div className="field">
        <label htmlFor={`backdropImage-${review?.id ?? "new"}`}>Backdrop URL</label>
        <input
          id={`backdropImage-${review?.id ?? "new"}`}
          name="backdropImage"
          defaultValue={review?.backdropImage ?? ""}
        />
      </div>
      <div className="field">
        <label htmlFor={`backdropFile-${review?.id ?? "new"}`}>Backdrop Upload</label>
        <input id={`backdropFile-${review?.id ?? "new"}`} name="backdropFile" type="file" accept="image/*" />
      </div>
      <div className="field-full">
        <label htmlFor={`genreTags-${review?.id ?? "new"}`}>Genre Tags</label>
        <input
          id={`genreTags-${review?.id ?? "new"}`}
          name="genreTags"
          defaultValue={review?.genreTags.join(", ") ?? ""}
          placeholder="Horror, Thriller"
        />
      </div>
      <div className="field-full">
        <label htmlFor={`moodTags-${review?.id ?? "new"}`}>Mood Tags</label>
        <input
          id={`moodTags-${review?.id ?? "new"}`}
          name="moodTags"
          defaultValue={review?.moodTags.join(", ") ?? ""}
          placeholder="Bleak, Stylish, Midnight"
        />
      </div>
      <div className="field-full">
        <label htmlFor={`quickHit-${review?.id ?? "new"}`}>Quick Hit</label>
        <textarea
          id={`quickHit-${review?.id ?? "new"}`}
          name="quickHit"
          defaultValue={review?.quickHit ?? ""}
        />
      </div>
      <div className="field-full">
        <label htmlFor={`fullTake-${review?.id ?? "new"}`}>Full Take</label>
        <textarea
          id={`fullTake-${review?.id ?? "new"}`}
          name="fullTake"
          defaultValue={review?.fullTake ?? ""}
        />
      </div>
      <div className="field">
        <label htmlFor={`video-${review?.id ?? "new"}`}>Video Review URL</label>
        <input
          id={`video-${review?.id ?? "new"}`}
          name="reviewVideoUrl"
          defaultValue={review?.reviewVideoUrl ?? ""}
        />
      </div>
      <div className="field">
        <label htmlFor={`watch-${review?.id ?? "new"}`}>Where To Watch URL</label>
        <input
          id={`watch-${review?.id ?? "new"}`}
          name="whereToWatchUrl"
          defaultValue={review?.whereToWatchUrl ?? ""}
        />
      </div>
      <div className="field">
        <label htmlFor={`featured-${review?.id ?? "new"}`}>Featured</label>
        <input
          id={`featured-${review?.id ?? "new"}`}
          name="featured"
          type="checkbox"
          defaultChecked={review?.featured ?? false}
        />
      </div>
      <div className="field-full">
        <div className="button-row">
          <button type="submit" className="button-primary">
            {isEditing ? "Save Changes" : "Create Review"}
          </button>
          {isEditing ? (
            <>
              <input type="hidden" name="slug" value={review?.slug} />
              <button
                type="submit"
                formAction={deleteReviewAction}
                className="danger-button"
              >
                Delete Review
              </button>
            </>
          ) : null}
        </div>
      </div>
    </form>
  );
}

export default async function AdminPage({ searchParams }: AdminPageProps) {
  const params = await searchParams;
  const error = typeof params.error === "string" ? params.error : "";
  const success = typeof params.success === "string" ? params.success : "";
  const authed = await isAdminAuthenticated();

  if (!authed) {
    return (
      <div className="page-stack">
        <section className="auth-panel">
          <p className="eyebrow">Admin Access</p>
          <h1>Sign in to manage Snap Critique</h1>
          <p>
            Set <code>ADMIN_PASSWORD</code> in your environment for production.
            If no environment password is set, the local fallback is{" "}
            <code>studio198-admin</code>.
          </p>
          {error ? <p className="muted-note">{error}</p> : null}
          <form action={loginAction} className="contact-form">
            <div className="field-full">
              <label htmlFor="password">Password</label>
              <input id="password" name="password" type="password" required />
            </div>
            <div className="field-full">
              <button type="submit" className="button-primary">
                Log In
              </button>
            </div>
          </form>
        </section>
      </div>
    );
  }

  const data = await readSiteData();

  return (
    <div className="page-stack">
      <section className="admin-shell">
        <p className="eyebrow">Admin Dashboard</p>
        <h1>Manage reviews, comments, and contact submissions</h1>
        <p>
          This MVP uses a file-backed content layer so you can add and update
          reviews without touching source files. Swap it to a database or CMS
          later without rebuilding the UI model.
        </p>

        {success ? <p className="muted-note">{success}</p> : null}
        {error ? <p className="muted-note">{error}</p> : null}

        <div className="button-row">
          <form action={logoutAction}>
            <button type="submit" className="button-secondary">
              Log Out
            </button>
          </form>
        </div>

        <div className="stats-strip">
          <div>
            <strong>{data.reviews.length}</strong>
            <span>Total reviews</span>
          </div>
          <div>
            <strong>{data.comments.length}</strong>
            <span>Total comments</span>
          </div>
          <div>
            <strong>{data.inquiries.length}</strong>
            <span>Inbox messages</span>
          </div>
        </div>

        <h2>Create Review</h2>
        <ReviewForm />
      </section>

      <section className="admin-shell">
        <p className="eyebrow">Existing Reviews</p>
        <h2>Edit published and draft entries</h2>
        <div className="stack-list">
          {data.reviews.map((review) => (
            <details key={review.id} className="admin-item">
              <summary>
                {review.movieTitle} · {review.status} · {formatDate(review.updatedAt)}
              </summary>
              <ReviewForm review={review} />
            </details>
          ))}
        </div>
      </section>

      <section className="admin-shell">
        <p className="eyebrow">Comment Moderation</p>
        <h2>Show, hide, or delete audience replies</h2>
        <div className="stack-list">
          {data.comments.map((comment) => (
            <div key={comment.id} className="admin-item">
              <div>
                <strong>{comment.displayName}</strong>
                <p>
                  {comment.reviewSlug} · {comment.status} ·{" "}
                  {formatDate(comment.createdAt)}
                </p>
                <p>{comment.body}</p>
              </div>
              <div className="button-row">
                <form action={toggleCommentVisibilityAction}>
                  <input type="hidden" name="commentId" value={comment.id} />
                  <input
                    type="hidden"
                    name="nextStatus"
                    value={comment.status === "visible" ? "hidden" : "visible"}
                  />
                  <button type="submit" className="button-secondary">
                    {comment.status === "visible" ? "Hide" : "Show"}
                  </button>
                </form>
                <form action={deleteCommentAction}>
                  <input type="hidden" name="commentId" value={comment.id} />
                  <button type="submit" className="danger-button">
                    Delete
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="admin-shell">
        <p className="eyebrow">Inbox</p>
        <h2>Contact and submission messages</h2>
        <div className="stack-list">
          {data.inquiries.length ? (
            data.inquiries.map((inquiry) => (
              <div key={inquiry.id} className="admin-item">
                <div>
                  <strong>{inquiry.subject || "General inquiry"}</strong>
                  <p>
                    {inquiry.name} · {inquiry.email} ·{" "}
                    {formatDate(inquiry.createdAt)}
                  </p>
                  <p>{inquiry.message}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="empty-state">No inquiries yet.</p>
          )}
        </div>
      </section>
    </div>
  );
}

import { readSiteData } from "@/lib/site-data";
import { getReviewerPresentation } from "@/lib/utils";

const crew = [
  {
    image: "/about/mindy.jpg",
    name: "MINDY S",
    tone: "mindy",
    meta: ["Eufaula, AL", "Melynda’s Love", "Los Angeles Film School"],
    description: "Brings instinct and emotional read to every review.",
    socials: [],
  },
  {
    image: "/about/ace.jpg",
    name: "ACE B",
    tone: "ace",
    meta: [
      "Lawton, OK",
      "Studio 198",
      "Los Angeles Film School",
      "www.moviesbybrad.com",
    ],
    description: "Executioner of the verdict. Built the system.",
    socials: [
      {
        label: "Facebook",
        href: "https://www.facebook.com/profile.php?id=61574699900336",
      },
      {
        label: "Instagram",
        href: "https://www.instagram.com/acebehnkebrad/",
      },
      {
        label: "LinkedIn",
        href: "https://www.linkedin.com/in/brad-behnke-thedoocumantguy/",
      },
      {
        label: "FilmFreeway",
        href: "https://filmfreeway.com/BradBehnke",
      },
      {
        label: "IMDb",
        href: "https://www.imdb.com/user/ur180728718/?ref_=hm_nv_profile",
      },
      {
        label: "X",
        href: "https://x.com/BradLeebehnke2",
      },
      {
        label: "YouTube",
        href: "https://www.youtube.com/@AceStudio198",
      },
      {
        label: "TikTok",
        href: "https://www.tiktok.com/@stud1o19884o0",
      },
    ],
  },
  {
    image: "/about/leeanne.jpg",
    name: "LEEANNE",
    tone: "leeanna",
    meta: [
      "Cleveland, TN",
      "One Generation Studio",
      "Los Angeles Film School",
    ],
    description: "Focuses on story, pacing, and structure.",
    socials: [
      {
        label: "One Generation Studio",
        href: "https://onegenerationstudio.square.site/",
      },
    ],
  },
];

export default async function AboutPage() {
  const data = await readSiteData();
  const reviewCounts = data.reviews.reduce<Record<string, number>>((totals, review) => {
    const { tone } = getReviewerPresentation(review.reviewerName);
    totals[tone] = (totals[tone] ?? 0) + 1;
    return totals;
  }, {});

  return (
    <main className="about-page">
      <section className="about-wrapper">
        <div className="about-hero">
          <p className="about-eyebrow">Studio 198 / Snap Critique</p>
          <h1 className="about-title">THE CREW BEHIND THE VERDICT</h1>
          <p className="about-intro">
            Three creators. One system. No fluff.
            <br />
            <br />
            What started in the same classroom at The Los Angeles Film School
            turned into something sharper — a platform built to cut through
            noise and deliver real takes on film.
            <br />
            <br />
            We don’t review movies the safe way. We break them down, call them
            out, and give you a verdict you can actually trust.
            <br />
            <br />
            <strong>Snap Critique isn’t about hype. It’s about truth.</strong>
          </p>
        </div>

        <div className="about-grid">
          {crew.map((member) => {
            const reviewCount = reviewCounts[member.tone] ?? 0;
            const role = `${reviewCount} REVIEW${reviewCount === 1 ? "" : "S"}`;

            return (
              <article key={member.name} className="about-card">
                <div className="about-portrait-shell">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="about-avatar"
                  />
                </div>

                <div className="about-copy">
                  <p className="about-role">{`${member.name} — ${role}`}</p>
                  <h2 className="about-name">{member.name}</h2>
                  <p className="about-meta">
                    {member.meta.map((line) => (
                      <span key={line}>{line}</span>
                    ))}
                  </p>
                  {member.socials.length ? (
                    <div className="about-socials">
                      {member.socials.map((social) => (
                        <a
                          key={social.href}
                          href={social.href}
                          target="_blank"
                          rel="noreferrer"
                          className="about-social-link"
                        >
                          {social.label}
                        </a>
                      ))}
                    </div>
                  ) : null}
                  <p className="about-desc">{member.description}</p>
                </div>
              </article>
            );
          })}
        </div>

        <p className="about-footer">Three perspectives. One verdict system.</p>
      </section>
    </main>
  );
}

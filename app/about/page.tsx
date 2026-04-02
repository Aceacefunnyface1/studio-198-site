const crew = [
  {
    image: "/about/mandy.jpg",
    name: "MANDY S",
    role: "100 REVIEWS",
    meta: ["Eufaula, AL", "Melynda’s Love", "Los Angeles Film School"],
    description: "Brings instinct and emotional read to every review.",
  },
  {
    image: "/about/ace.jpg",
    name: "ACE B",
    role: "",
    meta: [
      "Lawton, OK",
      "Studio 198",
      "Los Angeles Film School",
      "www.moviesbybrad.com",
    ],
    description: "Executioner of the verdict. Built the system.",
  },
  {
    image: "/about/leeanne.jpg",
    name: "LEEANNE",
    role: "100 REVIEWS",
    meta: [
      "Cleveland, TN",
      "One Generation Studio",
      "Los Angeles Film School",
    ],
    description: "Focuses on story, pacing, and structure.",
  },
];

export default function AboutPage() {
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
          {crew.map((member) => (
            <article key={member.name} className="about-card">
              <div className="about-portrait-shell">
                <img
                  src={member.image}
                  alt={member.name}
                  className="about-avatar"
                />
              </div>

              <div className="about-copy">
                {member.role ? (
                  <p className="about-role">{`${member.name} — ${member.role}`}</p>
                ) : null}
                <h2 className="about-name">{member.name}</h2>
                <p className="about-meta">
                  {member.meta.map((line) => (
                    <span key={line}>{line}</span>
                  ))}
                </p>
                <p className="about-desc">{member.description}</p>
              </div>
            </article>
          ))}
        </div>

        <p className="about-footer">Three perspectives. One verdict system.</p>
      </section>
    </main>
  );
}

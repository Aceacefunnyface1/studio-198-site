export default function AboutPage() {
  return (
    <main className="about-page">
      <section className="about-wrapper">
        <h1 className="about-title">THE CREW BEHIND THE VERDICT</h1>

        <p className="about-intro">
          Three creators. One system. No fluff.
          <br />
          <br />
          What started in the same classroom at The Los Angeles Film School
          turned into something sharper — a platform built to cut through noise
          and deliver real takes on film.
          <br />
          <br />
          We don’t review movies the safe way. We break them down, call them
          out, and give you a verdict you can actually trust.
          <br />
          <br />
          <strong>Snap Critique isn’t about hype. It’s about truth.</strong>
        </p>

        <div className="about-grid">
          <div className="about-card">
            <img src="/about/mandy.jpg" className="about-avatar" />
            <h2 className="about-name">MANDY S</h2>
            <p className="about-meta">
              Eufaula, AL
              <br />
              Melynda’s Love
              <br />
              Los Angeles Film School
            </p>
            <p className="about-desc">
              Brings instinct and emotional read to every review.
            </p>
          </div>

          <div className="about-card">
            <img src="/about/ace.jpg" className="about-avatar" />
            <h2 className="about-name">ACE B</h2>
            <p className="about-meta">
              Lawton, OK
              <br />
              Studio 198
              <br />
              Los Angeles Film School
              <br />
              www.moviesbybrad.com
            </p>
            <p className="about-desc">
              Executioner of the verdict. Built the system.
            </p>
          </div>

          <div className="about-card">
            <img src="/about/leeanne.jpg" className="about-avatar" />
            <h2 className="about-name">LEEANNE</h2>
            <p className="about-meta">
              Cleveland, TN
              <br />
              One Generation Studio
              <br />
              Los Angeles Film School
            </p>
            <p className="about-desc">
              Focuses on story, pacing, and structure.
            </p>
          </div>
        </div>

        <p className="about-footer">Three perspectives. One verdict system.</p>
      </section>
    </main>
  );
}

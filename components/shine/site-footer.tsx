import { siteInfo } from "@/lib/shine-on-data";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container site-footer__inner">
        <div className="site-footer__brand">
          <p className="eyebrow">Undercover Transportation</p>
          <h2>{siteInfo.name}</h2>
          <p>
            {siteInfo.addressLine1}
            <br />
            Cash rides in Lawton, OK
          </p>
        </div>

        <div>
          <h3>Availability</h3>
          <p>Daily from 6AM to 9PM</p>
          <p>Starting at $6</p>
        </div>

        <div>
          <h3>Contact</h3>
          <p>
            Call or text: <a href={siteInfo.phoneHref}>{siteInfo.phoneDisplay}</a>
          </p>
          <p>
            <a href={siteInfo.smsHref}>
              Text Matthew
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

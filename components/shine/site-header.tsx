import { siteInfo } from "@/lib/shine-on-data";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <a href="#top" className="brand-mark" aria-label={`${siteInfo.name} home`}>
          <span className="brand-mark__crest">UT</span>
          <span className="brand-mark__copy">
            <span className="brand-mark__kicker">Lawton, Oklahoma</span>
            <span className="brand-mark__title">{siteInfo.name}</span>
          </span>
        </a>

        <div className="header-ctas">
          <a href={siteInfo.smsHref} className="button button--secondary">
            Text Now
          </a>
          <a href={siteInfo.phoneHref} className="button button--primary">
            Call Now
          </a>
        </div>
        <a href={siteInfo.phoneHref} className="header-phone">
          {siteInfo.phoneDisplay}
        </a>
      </div>
    </header>
  );
}

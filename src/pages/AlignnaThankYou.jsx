import { Link } from "react-router-dom";
import { useEffect } from "react";
import alignnaWordmarkUrl from "../assets/michPageAssets/logos-icons/Alignna-BlancoRoto.svg";
import "./AlignnaThankYou.css";

const assets = {
  mark: "/thank-you-page-assets/A-MaderaClara.svg",
  kickstarterK: "/thank-you-page-assets/kickstarter-logo-k-white.png",
};

export default function AlignnaThankYou() {
  useEffect(() => {
    document.title = "You're on the list — Alignna";
    const prevBg = document.body.style.background;
    document.body.style.background = "#f7f3ec";
    return () => {
      document.body.style.background = prevBg;
    };
  }, []);

  return (
    <main className="alignnaThanks">
      <div className="alignnaThanks__page">
        <Link className="alignnaThanks__brand" to="/alignna-v2" aria-label="Alignna">
          <span
            className="alignnaThanks__wordmark"
            role="img"
            aria-label="Alignna"
            style={{
              WebkitMaskImage: `url("${alignnaWordmarkUrl}")`,
              maskImage: `url("${alignnaWordmarkUrl}")`,
            }}
          />
        </Link>

        <div className="alignnaThanks__pulse" aria-hidden="true">
          <span className="alignnaThanks__ring" />
          <span className="alignnaThanks__ring" />
          <span className="alignnaThanks__ring" />
          <span className="alignnaThanks__mark">
            <img src={assets.mark} alt="" />
          </span>
        </div>

        <h1>You&apos;re on the list.</h1>

        <p className="alignnaThanks__sub">
          We&apos;ll email you the moment the Kickstarter goes live, with early-bird
          pricing before it opens to everyone else.
        </p>

        <div className="alignnaThanks__actions">
          <a
            className="alignnaThanks__card alignnaThanks__card--facebook"
            href="#"
            onClick={(e) => e.preventDefault()}
          >
            <span className="alignnaThanks__cardIcon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </span>
            <span className="alignnaThanks__cardText">
              <span className="alignnaThanks__cardTitle">Join the community launching group</span>
              <span className="alignnaThanks__cardDesc">
                You&apos;ll be able to see the behind the scenes, prototypes, and how
                Alignna gets built. Don&apos;t miss on our giveaways
              </span>
            </span>
            <span className="alignnaThanks__cardArrow" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </span>
          </a>

          <a
            className="alignnaThanks__card alignnaThanks__card--kickstarter"
            href="#"
            onClick={(e) => e.preventDefault()}
          >
            <span className="alignnaThanks__cardIcon" aria-hidden="true">
              <img src={assets.kickstarterK} alt="" />
            </span>
            <span className="alignnaThanks__cardText">
              <span className="alignnaThanks__cardTitle">Follow on Kickstarter</span>
              <span className="alignnaThanks__cardDesc">
                One tap now, so you don&apos;t miss the launch window.
              </span>
            </span>
            <span className="alignnaThanks__cardArrow" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </span>
          </a>
        </div>

        <p className="alignnaThanks__note">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="2" y="4" width="20" height="16" rx="2" />
            <path d="m22 7-10 5L2 7" />
          </svg>
          No noise. Only launch news.
        </p>
      </div>
    </main>
  );
}

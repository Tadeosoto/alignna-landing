import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import WaitlistForm from "../landingPage/components/WaitlistForm";
import alignnaWordmarkUrl from "../assets/michPageAssets/logos-icons/Alignna-BlancoRoto.svg";
import "./AlignnaV2.css";

const sectionImage = (filename) =>
  `/images-inside-sections/${encodeURIComponent(filename)}`;

const lifestyleSize = {
  "01": { smallWidth: 800, smallHeight: 533, width: 1600, height: 1067 },
  "02": { smallWidth: 640, smallHeight: 800, width: 1280, height: 1600 },
  "03": { smallWidth: 800, smallHeight: 533, width: 1600, height: 1067 },
  "04": { smallWidth: 800, smallHeight: 533, width: 1600, height: 1067 },
  "05": { smallWidth: 800, smallHeight: 533, width: 1600, height: 1067 },
  "06": { smallWidth: 533, smallHeight: 800, width: 1067, height: 1600 },
  "07": { smallWidth: 800, smallHeight: 533, width: 1600, height: 1067 },
  "08": { smallWidth: 533, smallHeight: 800, width: 1067, height: 1600 },
};

const lifestyleShot = (index) => {
  const id = String(index).padStart(2, "0");
  return {
    image: `/fotos-wear-every-situation/lifestyle-${id}-1600.webp`,
    imageSmall: `/fotos-wear-every-situation/lifestyle-${id}-800.webp`,
    ...lifestyleSize[id],
  };
};

const loopVideo = (name) => ({
  src: `/videos-and-posters/${name}.mp4`,
  poster: `/videos-and-posters/${name}-poster.webp`,
});

const loopVideos = {
  hero: loopVideo("hero-vibracion"),
  stepWear: loopVideo("step1-wear-it"),
  stepFeel: loopVideo("step2-feel-it"),
  stepOwn: loopVideo("step3-own-it-bens"),
  inside: loopVideo("inside-charcoal-3x4"),
  problemBefore: loopVideo("section2-without"),
  problemAfter: loopVideo("section2-with"),
};

const sectionImages = {
  launchBelt: sectionImage("Section 5 Image 1 V01.png"),
  founder: sectionImage("imagen-about-founder.png"),
  kickstarterLogo: sectionImage("KS-logo-hero.png"),
  kickstarterWordmark: sectionImage("Kickstarter-Logo.svg"),
};

const colorShot = (slug, objectPosition) => ({
  image: `/colores-producto/color-${slug}-1080.webp`,
  imageSmall: `/colores-producto/color-${slug}-540.webp`,
  smallWidth: 540,
  smallHeight: 675,
  width: 1080,
  height: 1350,
  ...(objectPosition ? { objectPosition } : {}),
});

function attachInlinePlayback(node) {
  if (!node) return;
  node.muted = true;
  node.defaultMuted = true;
  node.playsInline = true;
  node.setAttribute("muted", "");
  node.setAttribute("playsinline", "");
  node.setAttribute("webkit-playsinline", "true");
}

function LoopVideo({ src, poster, className, label, eager = false }) {
  const videoRef = useRef(null);
  const reduceMotion = useReducedMotion();
  const [covered, setCovered] = useState(true);
  const allowPlay = reduceMotion !== true;

  useLayoutEffect(() => {
    const video = videoRef.current;
    if (!video) return undefined;
    attachInlinePlayback(video);

    const reduce =
      reduceMotion === true ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      video.autoplay = false;
      video.removeAttribute("autoplay");
      video.pause();
      return undefined;
    }

    const play = () => {
      attachInlinePlayback(video);
      const pending = video.play();
      if (pending) pending.catch(() => {});
    };

    const inView = () => {
      const rect = video.getBoundingClientRect();
      const visible =
        Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0);
      return rect.height > 0 && visible / rect.height >= 0.15;
    };

    const syncCover = () => {
      if (!video.paused) {
        setCovered(false);
        return;
      }
      if (video.currentTime >= 0.05) setCovered(true);
    };

    if (eager || inView()) play();
    video.addEventListener("canplay", play);
    video.addEventListener("playing", syncCover);
    video.addEventListener("pause", syncCover);
    syncCover();

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) play();
        else video.pause();
      },
      { threshold: 0.15 },
    );
    observer.observe(video);
    return () => {
      video.removeEventListener("canplay", play);
      video.removeEventListener("playing", syncCover);
      video.removeEventListener("pause", syncCover);
      observer.disconnect();
    };
  }, [eager, reduceMotion, src]);

  return (
    <>
      <video
        ref={(node) => {
          videoRef.current = node;
          attachInlinePlayback(node);
        }}
        className={className}
        poster={poster}
        muted
        loop
        playsInline
        autoPlay={allowPlay}
        preload={eager ? "auto" : "none"}
        controls={false}
        disablePictureInPicture
        disableRemotePlayback
        aria-hidden={label ? undefined : true}
        aria-label={label}
      >
        <source src={src} type="video/mp4" />
      </video>
      {covered ? (
        <img
          className={`${className ? `${className} ` : ""}alignnaV2__loopPoster`}
          src={poster}
          alt=""
          aria-hidden
          loading={eager ? "eager" : "lazy"}
          decoding={eager ? "auto" : "async"}
        />
      ) : null}
    </>
  );
}

const ease = [0.22, 0.61, 0.36, 1];
const viewport = { once: true, amount: 0.18 };
const reveal = {
  hidden: { opacity: 0, y: 28, filter: "blur(5px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.72, ease },
  },
};
const problemViewport = { once: true, amount: 0.35 };
const problemPanelLeft = {
  hidden: { opacity: 0, clipPath: "inset(0 100% 0 0)" },
  visible: {
    opacity: 1,
    clipPath: "inset(0 0 0 0)",
    transition: { duration: 0.85, ease, delay: 0 },
  },
};
const problemPanelRight = {
  hidden: { opacity: 0, clipPath: "inset(0 100% 0 0)" },
  visible: {
    opacity: 1,
    clipPath: "inset(0 0 0 0)",
    transition: { duration: 0.85, ease, delay: 1.45 },
  },
};
const problemPanelMobile = (delay) => ({
  hidden: { opacity: 0, clipPath: "inset(0 0 100% 0)" },
  visible: {
    opacity: 1,
    clipPath: "inset(0 0 0 0)",
    transition: { duration: 0.85, ease, delay },
  },
});
const problemArrowReveal = {
  hidden: { opacity: 0, scaleX: 0, transformOrigin: "left center" },
  visible: { opacity: 1, scaleX: 1, transformOrigin: "left center" },
};
const problemArrowLeft = {
  ...problemArrowReveal,
  visible: {
    ...problemArrowReveal.visible,
    transition: { duration: 0.55, ease, delay: 0.45 },
  },
};
const problemNowReveal = {
  hidden: { opacity: 0, scale: 0.72 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.45, ease, delay: 0.85 },
  },
};
const problemArrowRight = {
  ...problemArrowReveal,
  visible: {
    ...problemArrowReveal.visible,
    transition: { duration: 0.55, ease, delay: 1.15 },
  },
};
const problemArrowDown = {
  hidden: { opacity: 0, scaleY: 0, transformOrigin: "top center" },
  visible: {
    opacity: 1,
    scaleY: 1,
    transformOrigin: "top center",
    transition: { duration: 0.55, ease, delay: 0.45 },
  },
};
const problemArrowDown2 = {
  hidden: { opacity: 0, scaleY: 0, transformOrigin: "top center" },
  visible: {
    opacity: 1,
    scaleY: 1,
    transformOrigin: "top center",
    transition: { duration: 0.55, ease, delay: 1.15 },
  },
};
const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.11, delayChildren: 0.06 } },
};

const formCopy = {
  emailPlaceholder: "Email address",
  emailLabel: "Email address",
  errorEmpty: "Please enter your email.",
  errorSend: "Could not send. Please try again.",
  success: "Done. We’ll notify you when launch is ready.",
  successMailto: "Your email client opened to finish signup.",
  submitting: "Securing…",
};

const launchFormCopy = {
  ...formCopy,
  emailPlaceholder: "Your email",
  note: "No payment. No obligation.",
};

const heroFormCopy = {
  ...formCopy,
  note: "No payment. No obligation. We'll send you the Kickstarter link before the public launch.",
};

const stepsViewport = { once: true, amount: 0.25 };
const stepColumnDesktop = (index) => ({
  hidden: { opacity: 0, clipPath: "inset(0 100% 0 0)" },
  visible: {
    opacity: 1,
    clipPath: "inset(0 0 0 0)",
    transition: {
      duration: 0.65,
      ease,
      delay: index * 0.45,
      staggerChildren: 0.12,
      delayChildren: 0.14,
    },
  },
});
const stepColumnMobile = (index) => ({
  hidden: { opacity: 0, clipPath: "inset(0 0 100% 0)" },
  visible: {
    opacity: 1,
    clipPath: "inset(0 0 0 0)",
    transition: {
      duration: 0.65,
      ease,
      delay: index * 0.35,
      staggerChildren: 0.1,
      delayChildren: 0.12,
    },
  },
});
const stepFieldReveal = {
  hidden: { opacity: 0, clipPath: "inset(0 0 100% 0)" },
  visible: {
    opacity: 1,
    clipPath: "inset(0 0 0 0)",
    transition: { duration: 0.5, ease },
  },
};

const insideFeaturesLeft = [
  {
    title: "Silent haptic motor.",
    body: "A quiet vibration only you feel.",
  },
  {
    title: "Precision sensing.",
    body: "Calibrated to your body, not an average one.",
  },
  {
    title: "Tap control.",
    body: "No buttons to find, just tap.",
  },
];

const insideFeaturesRight = [
  {
    title: "Soft, breathable strap.",
    body: "Comfortable through your day.",
  },
  {
    title: "Adjustable fit.",
    body: "Adjust it to fit your body.",
  },
  {
    title: "Bluetooth sync.",
    body: "See your awareness history in the Alignna app.",
    badge: "App in development",
  },
];

const steps = [
  {
    number: 1,
    title: "Wear it",
    body: "Use Alignna at your desk, on the move, before an event, or whenever you want to feel more aware and present.",
    media: loopVideos.stepWear,
    alt: "Person wearing the Alignna belt",
  },
  {
    number: 2,
    title: "Feel it",
    body: "When your core lets go, Alignna sends a subtle vibration cue, before a mirror or photograph points it out.",
    media: loopVideos.stepFeel,
    alt: "Alignna belt sending a vibration cue",
  },
  {
    number: 3,
    title: "Own it",
    body: "You make the adjustment. With repetition, you practice an awareness that belongs to you, not the belt.",
    media: loopVideos.stepOwn,
    alt: "Person confidently wearing Alignna in daily life",
  },
];

const lifeSlides = [
  {
    id: "light",
    label: "Light",
    ...lifestyleShot(1),
    alt: "Friends gathered around a table outdoors, wearing Alignna",
    body: "Joy that does not ask you to perform. Awareness that stays soft, so the moment can stay yours.",
  },
  {
    id: "together",
    label: "Together",
    ...lifestyleShot(2),
    alt: "Woman walking along the shoreline wearing Alignna",
    body: "Belonging without second-guessing yourself. Present with the people who matter.",
  },
  {
    id: "ease",
    label: "Ease",
    ...lifestyleShot(3),
    alt: "Two men running on the beach wearing Alignna",
    body: "The unhurried feeling of a day with nowhere to be. A quiet cue before you drift.",
  },
  {
    id: "still",
    label: "Still",
    ...lifestyleShot(4),
    alt: "Group of women walking across a park wearing Alignna",
    body: "Breath, horizon, and room to settle. Support that respects the calm you are building.",
  },
  {
    id: "flow",
    label: "Flow",
    ...lifestyleShot(5),
    alt: "Women stretching on the beach wearing Alignna",
    body: "Movement that feels natural, not forced. Your body in rhythm, your posture following.",
  },
  {
    id: "open",
    label: "Open",
    ...lifestyleShot(6),
    alt: "Woman meditating by the ocean wearing Alignna",
    body: "Confidence that does not need announcing. Wear it like it was always part of you.",
  },
  {
    id: "alive",
    label: "Alive",
    ...lifestyleShot(7),
    alt: "Three women walking beside the water wearing Alignna",
    body: "Energy in your stride, ease in your core. Stay aware while life moves fast.",
  },
  {
    id: "whole",
    label: "Whole",
    ...lifestyleShot(8),
    alt: "Woman wearing the Alignna belt while leaning on a park bench",
    body: "Not a fix for how you look—a habit for how you feel. More you, more often.",
  },
];

const colorSlides = [
  {
    id: "black",
    label: "Black",
    ...colorShot("negro", "center 61.2%"),
    alt: "Alignna belt in black",
    body: "A deep black strap with the same discreet profile.",
  },
  {
    id: "gray",
    label: "Gray",
    ...colorShot("gris", "center 54.4%"),
    alt: "Alignna belt in gray",
    body: "A cool neutral strap that pairs with everyday outfits.",
  },
  {
    id: "olive",
    label: "Olive",
    ...colorShot("verde-olivo"),
    alt: "Alignna belt in olive green",
    body: "An earthy green option for understated wear.",
  },
  {
    id: "brown",
    label: "Brown",
    ...colorShot("cafe"),
    alt: "Alignna belt in brown",
    body: "A warm brown strap that pairs with everyday outfits.",
  },
];

const quotes = [
  {
    initials: "KK",
    name: "Karen Kelly, 32",
    quote: "I don’t ask people to delete photos of me anymore.",
    featured: true,
  },
  {
    initials: "SY",
    name: "Sofia Yañez, 34",
    quote: "I tried it to look better. It changed how I talk about myself.",
  },
  {
    initials: "EA",
    name: "Emilia Armstrong, 26",
    quote:
      "I feel so different, but it’s still me, my body, a 1 sec fix that changed my whole stance.",
  },
];

function useIsMobile(maxWidth = 760) {
  const query = `(max-width: ${maxWidth}px)`;
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== "undefined" && window.matchMedia(query).matches,
  );
  useEffect(() => {
    const mq = window.matchMedia(query);
    const onChange = () => setIsMobile(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [query]);
  return isMobile;
}

function Check({ children }) {
  return (
    <li>
      <span>✓</span>
      {children}
    </li>
  );
}

const vibrateTransition = {
  duration: 0.4,
  ease: "easeInOut",
  repeat: Infinity,
  repeatDelay: 2.5,
};

const vibrateX = [0, -2, 2, -2, 2, -1, 1, 0];

function VibrationWord({ children }) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <strong className="alignnaV2Hero__vibrate">{children}</strong>;
  }

  return (
    <motion.strong
      className="alignnaV2Hero__vibrate"
      animate={{ x: vibrateX }}
      transition={vibrateTransition}
    >
      {children}
    </motion.strong>
  );
}

function AlignnaWordmark({ className = "" }) {
  const reduceMotion = useReducedMotion();
  const maskStyle = {
    WebkitMaskImage: `url("${alignnaWordmarkUrl}")`,
    maskImage: `url("${alignnaWordmarkUrl}")`,
  };

  if (reduceMotion) {
    return (
      <span
        className={`alignnaV2__wordmarkInline ${className}`.trim()}
        role="img"
        aria-label="Alignna"
        style={maskStyle}
      />
    );
  }

  return (
    <motion.span
      className={`alignnaV2__wordmarkInline ${className}`.trim()}
      role="img"
      aria-label="Alignna"
      style={maskStyle}
      animate={{ x: vibrateX }}
      transition={vibrateTransition}
    />
  );
}

function KickstarterBadge() {
  return (
    <img
      className="alignnaV2Hero__kickstarterBadge"
      src={sectionImages.kickstarterLogo}
      alt="Kickstarter coming soon"
    />
  );
}

function PriceBadge() {
  return (
    <div
      className="alignnaV2Hero__priceBadge"
      aria-label="First 24 hours, 99 US dollars on Kickstarter"
    >
      <span>First 24 hours</span>
      <strong>USD $99</strong>
      <small>On Kickstarter</small>
    </div>
  );
}

function MediaCarouselSection({
  className,
  ariaLabel,
  slides,
  introTitle,
  eyebrow,
  heading,
  variant = "lifestyle",
  thumbAriaLabel = "Scenes",
  prevLabel = "Previous slide",
  nextLabel = "Next slide",
  thumbVisibleCount,
}) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const total = slides.length;
  const slide = slides[index];
  const isProduct = variant === "product";
  const go = (delta) =>
    setIndex((current) => (current + delta + total) % total);
  const useThumbCarousel =
    typeof thumbVisibleCount === "number" && thumbVisibleCount > 0;
  const thumbStart =
    useThumbCarousel && total > thumbVisibleCount
      ? Math.max(
          0,
          Math.min(index - (thumbVisibleCount - 1), total - thumbVisibleCount),
        )
      : 0;

  useEffect(() => {
    if (paused) return undefined;
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % total);
    }, 5200);
    return () => window.clearInterval(timer);
  }, [index, paused, total]);

  return (
    <section
      className={className}
      aria-roledescription="carousel"
      aria-label={ariaLabel}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {introTitle ? (
        <motion.div
          className={`${className}__intro`}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          variants={reveal}
        >
          <h2>{introTitle}</h2>
        </motion.div>
      ) : null}
      <div className={`${className}__shell`}>
        <div className={`${className}__media`}>
          <div className={`${className}__stage`}>
            <AnimatePresence mode="sync">
              <motion.div
                key={slide.id}
                className={`${className}__frame`}
                initial={{ opacity: 0, scale: isProduct ? 1.22 : 1.035 }}
                animate={{ opacity: 1, scale: isProduct ? 1.18 : 1 }}
                exit={{ opacity: 0, scale: isProduct ? 1.2 : 1.02 }}
                transition={{ duration: 0.85, ease }}
              >
                {slide.imageSmall ? (
                  <picture>
                    <source
                      media="(max-width: 760px)"
                      srcSet={slide.imageSmall}
                    />
                    <img
                      src={slide.image}
                      srcSet={`${slide.imageSmall} ${slide.smallWidth}w, ${slide.image} ${slide.width}w`}
                      sizes="(max-width: 1024px) 92vw, 44rem"
                      alt={slide.alt}
                      width={slide.width}
                      height={slide.height}
                      loading="lazy"
                      decoding="async"
                      style={
                        slide.objectPosition
                          ? { objectPosition: slide.objectPosition }
                          : undefined
                      }
                    />
                  </picture>
                ) : (
                  <img
                    src={slide.image}
                    alt={slide.alt}
                    loading="lazy"
                    decoding="async"
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
          <div className={`${className}__nav`}>
            <button
              type="button"
              className={`${className}__arrow`}
              onClick={() => go(-1)}
              aria-label={prevLabel}
            >
              ‹
            </button>
            {useThumbCarousel ? (
              <div
                className={`${className}__thumbsViewport`}
                style={{
                  "--thumb-offset": thumbStart,
                  "--thumb-visible": thumbVisibleCount,
                }}
              >
                <div
                  className={`${className}__thumbs ${className}__thumbs--carousel`}
                  role="tablist"
                  aria-label={thumbAriaLabel}
                >
                  {slides.map((item, itemIndex) => (
                    <button
                      key={item.id}
                      type="button"
                      role="tab"
                      aria-selected={itemIndex === index}
                      className={`${className}__thumb${itemIndex === index ? " is-active" : ""}`}
                      onClick={() => setIndex(itemIndex)}
                    >
                      <span className={`${className}__thumbFrame`}>
                        <img
                          src={item.imageSmall || item.image}
                          alt=""
                          width={item.smallWidth}
                          height={item.smallHeight}
                          loading="lazy"
                          decoding="async"
                          style={
                            item.objectPosition
                              ? { objectPosition: item.objectPosition }
                              : undefined
                          }
                        />
                      </span>
                      <b>{item.label}</b>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div
                className={`${className}__thumbs`}
                role="tablist"
                aria-label={thumbAriaLabel}
              >
                {slides.map((item, itemIndex) => (
                  <button
                    key={item.id}
                    type="button"
                    role="tab"
                    aria-selected={itemIndex === index}
                    className={`${className}__thumb${itemIndex === index ? " is-active" : ""}`}
                    onClick={() => setIndex(itemIndex)}
                  >
                      <span className={`${className}__thumbFrame`}>
                        <img
                          src={item.imageSmall || item.image}
                          alt=""
                          width={item.smallWidth}
                          height={item.smallHeight}
                          loading="lazy"
                          decoding="async"
                          style={
                            item.objectPosition
                              ? { objectPosition: item.objectPosition }
                              : undefined
                          }
                        />
                      </span>
                    <b>{item.label}</b>
                  </button>
                ))}
              </div>
            )}
            <button
              type="button"
              className={`${className}__arrow`}
              onClick={() => go(1)}
              aria-label={nextLabel}
            >
              ›
            </button>
          </div>
        </div>
        <div className={`${className}__copy`}>
          <div className={`${className}__progress`}>
            <span className={`${className}__counter`}>
              {String(index + 1).padStart(2, "0")} /{" "}
              {String(total).padStart(2, "0")}
            </span>
            <div className={`${className}__bars`} aria-hidden>
              {slides.map((item, itemIndex) => (
                <i
                  key={item.id}
                  className={itemIndex === index ? "is-active" : ""}
                />
              ))}
            </div>
          </div>
          {eyebrow ? <p className="alignnaV2__eyebrow">{eyebrow}</p> : null}
          {heading ? <h2>{heading}</h2> : null}
          <AnimatePresence mode="wait">
            <motion.p
              key={slide.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.4, ease }}
            >
              {slide.body}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

function ColorsCarousel() {
  return (
    <MediaCarouselSection
      className="alignnaV2Colors"
      ariaLabel="Alignna color options"
      slides={colorSlides}
      introTitle="Match your lifestyle, available in the following colors"
      variant="product"
      thumbAriaLabel="Color options"
      prevLabel="Previous color"
      nextLabel="Next color"
    />
  );
}

function LifeCarousel() {
  return (
    <MediaCarouselSection
      className="alignnaV2Life"
      ariaLabel="Made for real life"
      slides={lifeSlides}
      introTitle="Wear it in every situation"
      eyebrow="On the move, while walking, or working, even for the in-betweens."
      heading="Made for real life."
      variant="lifestyle"
      thumbVisibleCount={2}
      thumbAriaLabel="Lifestyle scenes"
      prevLabel="Previous lifestyle"
      nextLabel="Next lifestyle"
    />
  );
}

function InsideFeature({ feature }) {
  return (
    <motion.li
      className="alignnaV2Inside__feature"
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
      variants={reveal}
    >
      <h3>{feature.title}</h3>
      <p>{feature.body}</p>
      {feature.badge ? (
        <span className="alignnaV2Inside__badge">{feature.badge}</span>
      ) : null}
    </motion.li>
  );
}

function SectionIntro({ eyebrow, title, body, className = "" }) {
  return (
    <motion.div
      className={`alignnaV2__intro ${className}`}
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
      variants={stagger}
    >
      <motion.p variants={reveal} className="alignnaV2__eyebrow">
        {eyebrow}
      </motion.p>
      <motion.h2 variants={reveal}>{title}</motion.h2>
      {body ? (
        <motion.p variants={reveal} className="alignnaV2__lead">
          {body}
        </motion.p>
      ) : null}
    </motion.div>
  );
}

export default function AlignnaV2() {
  const isMobile = useIsMobile();

  useEffect(() => {
    document.title = "Alignna";
  }, []);
  const panelLeftVariants = isMobile ? problemPanelMobile(0) : problemPanelLeft;
  const panelRightVariants = isMobile
    ? problemPanelMobile(1.45)
    : problemPanelRight;

  return (
    <div className="alignnaV2">
      <section className="alignnaV2Hero">
        <div className="alignnaV2Hero__media">
          <LoopVideo
            className="alignnaV2Hero__photo"
            src={loopVideos.hero.src}
            poster={loopVideos.hero.poster}
            eager
          />
          <KickstarterBadge />
          <PriceBadge />
        </div>
        <div className="alignnaV2Hero__veil" aria-hidden />
        <div className="alignnaV2Hero__inner">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="alignnaV2Hero__copy"
          >
            <motion.div variants={reveal} className="alignnaV2Hero__heading">
              <span
                className="alignnaV2Hero__wordmark"
                role="img"
                aria-label="Alignna"
                style={{
                  WebkitMaskImage: `url("${alignnaWordmarkUrl}")`,
                  maskImage: `url("${alignnaWordmarkUrl}")`,
                }}
              />
              <p className="alignnaV2__eyebrow">
                Real-time posture awareness <i />
              </p>
              <h1>A smart belt to avoid sticking out your belly.</h1>
              <p className="alignnaV2Hero__body">
                Gives you a subtle <VibrationWord>vibration</VibrationWord> cue
                when your core lets go, so you can reset in the moment.
              </p>
            </motion.div>
            <motion.div variants={reveal} className="alignnaV2Hero__details">
              <p className="alignnaV2Hero__subtitle">
                Notice it before the mirror does.
              </p>
              <ul className="alignnaV2Hero__checks">
                <Check>No squeezing</Check>
                <Check>No pulling</Check>
                <Check>No dependency</Check>
              </ul>
              <div className="alignnaV2Hero__form">
                <WaitlistForm
                  copy={heroFormCopy}
                  locale="en-AU"
                  source="alignna-v2-hero"
                  ctaLabel="Lock in Early Bird price"
                  variant="overlay"
                  idSuffix="alignna-v2-hero"
                  redirectTo="/thank-you-page"
                />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="alignnaV2Problem">
        <motion.div
          className="alignnaV2Problem__intro"
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          variants={stagger}
        >
          <motion.p variants={reveal} className="alignnaV2__eyebrow">
            The real problem
          </motion.p>
          <motion.h2 variants={reveal}>
            See the effects of posture awareness, without Alignna and with Alignna
          </motion.h2>
        </motion.div>
        <motion.div
          className="alignnaV2Problem__split"
          initial="hidden"
          whileInView="visible"
          viewport={problemViewport}
          variants={{ hidden: {}, visible: {} }}
        >
          <motion.article
            className="alignnaV2Problem__panel alignnaV2Problem__panel--left"
            variants={panelLeftVariants}
          >
            <LoopVideo
              src={loopVideos.problemBefore.src}
              poster={loopVideos.problemBefore.poster}
              label="Without Alignna"
            />
          </motion.article>

          <motion.div
            className="alignnaV2Problem__timeline alignnaV2Problem__timeline--mobile"
            aria-hidden="true"
            variants={{ hidden: {}, visible: {} }}
          >
            <motion.span
              className="alignnaV2Problem__arrow alignnaV2Problem__arrow--down"
              variants={problemArrowDown}
            />
            <motion.span
              className="alignnaV2Problem__now"
              variants={problemNowReveal}
            >
              Now
            </motion.span>
            <motion.span
              className="alignnaV2Problem__arrow alignnaV2Problem__arrow--down"
              variants={problemArrowDown2}
            />
          </motion.div>

          <motion.article
            className="alignnaV2Problem__panel alignnaV2Problem__panel--right"
            variants={panelRightVariants}
          >
            <LoopVideo
              src={loopVideos.problemAfter.src}
              poster={loopVideos.problemAfter.poster}
              label="With Alignna"
            />
          </motion.article>

          <motion.div
            className="alignnaV2Problem__timeline alignnaV2Problem__timeline--desktop"
            aria-hidden="true"
            variants={{ hidden: {}, visible: {} }}
          >
            <motion.span
              className="alignnaV2Problem__arrow alignnaV2Problem__arrow--left"
              variants={problemArrowLeft}
            />
            <motion.span
              className="alignnaV2Problem__now"
              variants={problemNowReveal}
            >
              Now
            </motion.span>
            <motion.span
              className="alignnaV2Problem__arrow alignnaV2Problem__arrow--right"
              variants={problemArrowRight}
            />
          </motion.div>
        </motion.div>
        <motion.p
          className="alignnaV2Problem__lead"
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          variants={reveal}
        >
          You straighten the second you see yourself. The posture was available
          all along, awareness simply arrived late. Alignna brings that habit to
          you.
        </motion.p>
      </section>

      <section className="alignnaV2Steps alignnaV2__light">
        <motion.div
          className="alignnaV2Steps__intro"
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          variants={stagger}
        >
          <motion.p variants={reveal} className="alignnaV2__eyebrow">
            Three steps
          </motion.p>
          <motion.h2 variants={reveal}>
            How <AlignnaWordmark className="alignnaV2Steps__wordmark" /> works
          </motion.h2>
        </motion.div>
        <motion.div
          className="alignnaV2Steps__grid"
          initial="hidden"
          whileInView="visible"
          viewport={stepsViewport}
          variants={{ hidden: {}, visible: {} }}
        >
          {steps.map((step, index) => (
            <motion.article
              key={step.number}
              className="alignnaV2Steps__step"
              variants={
                isMobile ? stepColumnMobile(index) : stepColumnDesktop(index)
              }
            >
              <motion.p
                className="alignnaV2Steps__number"
                variants={stepFieldReveal}
              >
                Step {step.number}
              </motion.p>
              <motion.h3 variants={stepFieldReveal}>{step.title}</motion.h3>
              <motion.div
                className={`alignnaV2Steps__media${
                  step.number === 1 ? " alignnaV2Steps__media--wear" : ""
                }`}
                variants={stepFieldReveal}
              >
                <LoopVideo
                  src={step.media.src}
                  poster={step.media.poster}
                  label={step.alt}
                />
              </motion.div>
              <motion.p
                className="alignnaV2Steps__body"
                variants={stepFieldReveal}
              >
                {step.body}
              </motion.p>
            </motion.article>
          ))}
        </motion.div>
      </section>

      <section className="alignnaV2Inside">
        <SectionIntro
          eyebrow="Inside Alignna"
          title="Quiet precision, built for everyday life."
        />
        <div className="alignnaV2Inside__stage">
          <ul className="alignnaV2Inside__features alignnaV2Inside__features--left">
            {insideFeaturesLeft.map((feature) => (
              <InsideFeature key={feature.title} feature={feature} />
            ))}
          </ul>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            variants={stagger}
            className="alignnaV2Inside__media"
          >
            <motion.div variants={reveal} className="alignnaV2Inside__render">
              <LoopVideo
                src={loopVideos.inside.src}
                poster={loopVideos.inside.poster}
                label="Alignna belt render"
              />
            </motion.div>
          </motion.div>
          <ul className="alignnaV2Inside__features alignnaV2Inside__features--right">
            {insideFeaturesRight.map((feature) => (
              <InsideFeature key={feature.title} feature={feature} />
            ))}
          </ul>
        </div>
        <p className="alignnaV2Inside__quote">
          Reviewed with a Pelvic Floor and Physiotherapist Specialist
        </p>
      </section>

      <section className="alignnaV2Launch">
        <div className="alignnaV2Launch__shell">
          <div className="alignnaV2Launch__blob" aria-hidden />
          <motion.div
            className="alignnaV2Launch__card"
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            variants={stagger}
          >
            <motion.div className="alignnaV2Launch__content" variants={reveal}>
              <p className="alignnaV2Launch__eyebrow">
                We&apos;re launching on
              </p>
              <img
                className="alignnaV2Launch__kickstarter"
                src={sectionImages.kickstarterWordmark}
                alt="Kickstarter"
                loading="lazy"
                decoding="async"
              />
              <h2>Before Alignna goes public.</h2>
              <p className="alignnaV2Launch__lead">
                Leave your email and we&apos;ll send you the campaign link
                before the public launch.
              </p>
              <WaitlistForm
                copy={launchFormCopy}
                locale="en-AU"
                source="alignna-v2-mid"
                ctaLabel="Lock in Early Bird price"
                variant="light"
                idSuffix="alignna-v2-mid"
                redirectTo="/thank-you-page"
              />
            </motion.div>
          </motion.div>
          <div className="alignnaV2Launch__beltWrap" aria-hidden>
            <motion.img
              className="alignnaV2Launch__belt"
              initial="hidden"
              whileInView="visible"
              viewport={viewport}
              variants={reveal}
              src={sectionImages.launchBelt}
              alt=""
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>
      </section>

      <ColorsCarousel />

      <LifeCarousel />

      <section className="alignnaV2Testimonials">
        <SectionIntro
          className="alignnaV2Testimonials__intro"
          eyebrow="Early experiences"
          title="What users are saying."
        />
        <motion.div
          className="alignnaV2Testimonials__board"
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          variants={stagger}
        >
          {quotes.map((item) => (
            <motion.article
              key={item.initials}
              variants={reveal}
              className={item.featured ? "is-featured" : ""}
            >
              <svg
                className="alignnaV2Testimonials__mark"
                viewBox="0 0 48 32"
                aria-hidden="true"
              >
                <path
                  fill="currentColor"
                  d="M18.2 32H0V17.6C0 7.5 6.2 1.2 16.2 0l2.1 6.8c-5.3 1.2-8 4.4-8 9.6V14h8V32zm29.8 0H29.8V17.6c0-10.1 6.2-16.4 16.2-17.6L48 6.8c-5.3 1.2-8 4.4-8 9.6V14h8V32z"
                />
              </svg>
              <p>{item.quote}</p>
              <footer>
                <b>{item.initials}</b>
                <span>{item.name}</span>
              </footer>
            </motion.article>
          ))}
        </motion.div>
      </section>

      <section className="alignnaV2Founder">
        <motion.div
          className="alignnaV2Founder__intro"
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          variants={reveal}
        >
          <h2>About the founder</h2>
        </motion.div>
        <div className="alignnaV2Founder__shell">
          <motion.figure
            className="alignnaV2Founder__media"
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            variants={reveal}
          >
            <img
              src={sectionImages.founder}
              alt="Michelle Castellanos, Alignna founder, holding the Alignna belt"
              loading="lazy"
              decoding="async"
            />
          </motion.figure>
          <div className="alignnaV2Founder__rule" aria-hidden />
          <motion.div
            className="alignnaV2Founder__copy"
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            variants={stagger}
          >
            <span className="alignnaV2Founder__quotes" aria-hidden>
              “
            </span>
            <motion.p variants={reveal} className="alignnaV2Founder__statement">
              I believe caring for your body should feel like freedom, not
              correction.
            </motion.p>
            <motion.div variants={reveal} className="alignnaV2Founder__body">
              <p>
                As a mechanical engineer who cares deeply about movement and
                wellbeing, I built the discreet reminder I wanted for myself.
                Twenty-five prototypes later, that idea became Alignna.
              </p>
            </motion.div>
            <motion.p variants={reveal} className="alignnaV2Founder__byline">
              <strong>Michelle Castellanos</strong>
              <span> • Mechanical engineer and founder of Alignna</span>
            </motion.p>
            <motion.p variants={reveal} className="alignnaV2Founder__pill">
              <span className="alignnaV2Founder__check" aria-hidden>
                <svg viewBox="0 0 16 16">
                  <path
                    d="M3.2 8.3 6.4 11.6 12.8 4.4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              25 prototypes
            </motion.p>
          </motion.div>
        </div>
      </section>

      <section className="alignnaV2Final">
        <div className="alignnaV2Final__panel">
          <motion.div
            className="alignnaV2Final__copy"
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            variants={stagger}
          >
            <motion.p variants={reveal} className="alignnaV2Final__soon">
              Coming soon on
            </motion.p>
            <motion.img
              variants={reveal}
              className="alignnaV2Final__kickstarter"
              src={sectionImages.kickstarterWordmark}
              alt="Kickstarter"
              loading="lazy"
              decoding="async"
            />
            <motion.h2 variants={reveal}>
              Secure the USD $99 launch offer.
            </motion.h2>
            <motion.p variants={reveal} className="alignnaV2Final__lead">
              Join the list now. We&apos;ll send you the Kickstarter link before
              Alignna goes public.
            </motion.p>
          </motion.div>

          <motion.div
            className="alignnaV2Final__visual"
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            variants={reveal}
          >
            <article className="alignnaV2Final__offer">
              <div className="alignnaV2Final__offerRow">
                <div className="alignnaV2Final__retail">
                  <small>Retail</small>
                  <s>USD 149</s>
                </div>
                <span className="alignnaV2Final__arrow" aria-hidden>
                  →
                </span>
                <div className="alignnaV2Final__pay">
                  <small>You pay</small>
                  <p>
                    <em>USD</em>
                    <strong>99</strong>
                  </p>
                </div>
                <b className="alignnaV2Final__badge">−40%</b>
              </div>
              <p className="alignnaV2Final__offerNote">
                First 24 hours only · then USD 129 for the rest of the campaign
              </p>
            </article>
            <img
              className="alignnaV2Final__belt"
              src={sectionImages.launchBelt}
              alt="Alignna belt"
              loading="lazy"
              decoding="async"
            />
          </motion.div>

          <motion.div
            className="alignnaV2Final__form"
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            variants={reveal}
          >
            <WaitlistForm
              copy={launchFormCopy}
              locale="en-AU"
              source="alignna-v2-final"
              ctaLabel="Lock in Early Bird price"
              variant="light"
              idSuffix="alignna-v2-final"
              redirectTo="/thank-you-page"
            />
          </motion.div>
        </div>
      </section>
    </div>
  );
}

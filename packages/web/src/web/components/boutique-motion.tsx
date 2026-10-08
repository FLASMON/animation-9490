import { useEffect, useState } from "react";
import { animate, inView, stagger } from "motion";
import { motion, useReducedMotion, useScroll, useSpring, useMotionValueEvent } from "motion/react";
import { ArrowUp } from "lucide-react";

const ease = [0.22, 1, 0.36, 1] as const;
const revealSelector = [".section-heading", ".center-heading", ".category-card", ".promo-card", ".story-collage", ".story-copy", ".product-card", ".seasonal", ".deal-card", ".wide-promo", ".editorial-card", ".review-content", ".article-card", ".instagram-grid > a", ".faq-layout", ".benefits > div", ".newsletter-layout", ".footer-grid > div", ".catalog-toolbar", ".catalog-filters", ".detail-image", ".detail-copy", ".order-summary", ".checkout-form", ".contact-form", ".contact-grid > div", ".article-detail > img", ".article-body"].join(",");

/** Progressive enhancement: content is visible without this hook or with reduced motion. */
export function useBoutiqueMotion(route: string) {
  const reduced = useReducedMotion();
  useEffect(() => {
    if (reduced) return;
    const animations: ReturnType<typeof animate>[] = [];
    const cleanups: (() => void)[] = [];
    const nodes = new WeakSet<Element>();
    const seen = new Set<string>();
    let observer: MutationObserver | undefined;
    const frame = requestAnimationFrame(() => {
      const heroCopy = document.querySelectorAll<HTMLElement>(".hero-copy > *");
      if (heroCopy.length) {
        animations.push(animate(heroCopy, { opacity: [0,1], y: [24,0] }, { duration: .9, delay: stagger(.09, { startDelay: .08 }), ease }));
        const portrait = document.querySelector<HTMLElement>(".hero-portrait");
        if (portrait) animations.push(animate(portrait, { opacity: [0,1], scale: [1.045,1], y: [20,0] }, { duration: 1.25, delay: .15, ease }));
        const floating = document.querySelector<HTMLElement>(".floating-product");
        if (floating) animations.push(animate(floating, { opacity: [0,1], x: [-18,0] }, { duration: .9, delay: .7, ease }));
      } else {
        const title = document.querySelectorAll<HTMLElement>(".page-title .eyebrow, .page-title h1, .page-title p:not(.eyebrow), .article-detail > h1, .order-success > *");
        if (title.length) animations.push(animate(title, { opacity: [0,1], y: [16,0] }, { duration: .65, delay: stagger(.06), ease }));
      }
      const register = () => {
        document.querySelectorAll<HTMLElement>(revealSelector).forEach(el => {
          if (nodes.has(el)) return;
          nodes.add(el);
          const section = el.closest("section")?.className || "page";
          const identity = `${section}:${el.className}:${el.dataset.motionKey || el.textContent?.trim().slice(0,90) || ""}`;
          if (seen.has(identity)) return;
          // Only off-screen elements are concealed. Visible interactions are never delayed.
          const rect = el.getBoundingClientRect();
          if (rect.top < innerHeight - 30 && rect.bottom > 0) {
            seen.add(identity);
            animations.push(animate(el, { opacity: [0,1], y: [18,0] }, { duration: .65, ease }));
            return;
          }
          el.style.opacity = "0";
          cleanups.push(inView(el, () => {
            seen.add(identity);
            const siblings = Array.from(el.parentElement?.children || []);
            const index = Math.max(0, siblings.indexOf(el));
            const cascade = el.matches(".product-card, .category-card, .article-card, .instagram-grid > a");
            animations.push(animate(el, { opacity: [0,1], y: [cascade ? 20 : 26,0] }, { duration: .75, delay: cascade ? (index % 4) * .07 : 0, ease }));
          }, { margin: "0px 0px -35px 0px" }));
        });
      };
      register();
      observer = new MutationObserver(register);
      observer.observe(document.getElementById("main-content")!, { childList: true, subtree: true });
    });
    return () => {
      cancelAnimationFrame(frame);
      observer?.disconnect();
      cleanups.forEach(stop => stop());
      animations.forEach(animation => animation.stop());
      document.querySelectorAll<HTMLElement>(revealSelector).forEach(el => { el.style.removeProperty("opacity"); el.style.removeProperty("transform"); });
    };
  }, [route, reduced]);
}

export function ScrollEnhancements() {
  const reduced = useReducedMotion();
  const { scrollY, scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 110, damping: 28 });
  const [showTop, setShowTop] = useState(false);
  useMotionValueEvent(scrollY, "change", y => {
    document.documentElement.dataset.scrolled = String(y > 80);
    setShowTop(y > 650);
  });
  useEffect(() => () => { delete document.documentElement.dataset.scrolled; }, []);
  return <>
    <motion.div className="reading-progress" style={{ scaleX: reduced ? scrollYProgress : smoothProgress }} aria-hidden="true"/>
    <button className={`back-to-top ${showTop ? "visible" : ""}`} tabIndex={showTop ? 0 : -1} aria-hidden={!showTop} aria-label="Retour en haut" onClick={() => window.scrollTo({ top: 0, behavior: reduced ? "instant" : "smooth" })}><ArrowUp size={18}/><span>Retour en haut</span></button>
  </>;
}
import { useLayoutEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { createPortal } from "react-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HeroOrbitalScene from "./HeroOrbitalScene";

gsap.registerPlugin(ScrollTrigger);

export default function HeroExperience() {
  const [mount, setMount] = useState<HTMLElement | null>(null);
  const [isActive, setIsActive] = useState(true);
  const [isReducedMotion, setIsReducedMotion] = useState(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  useLayoutEffect(() => {
    const hero = document.querySelector<HTMLElement>(".hero");
    const art = hero?.querySelector<HTMLElement>(".hero-scroll-art");
    const copy = hero?.querySelector<HTMLElement>(".hero-inner");
    if (!hero || !art || !copy) return;

    art.querySelector(".hero-orbit-canvas")?.remove();
    setMount(art);

    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleMotionChange = () => setIsReducedMotion(motionPreference.matches);
    motionPreference.addEventListener("change", handleMotionChange);

    const intersectionObserver = new IntersectionObserver(([entry]) => {
      setIsActive(entry.isIntersecting);
    }, { rootMargin: "100px" });
    intersectionObserver.observe(hero);

    const handleVisibilityChange = () => {
      setIsActive(!document.hidden && hero.getBoundingClientRect().bottom > 0 && hero.getBoundingClientRect().top < window.innerHeight);
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    const motionContext = gsap.matchMedia();
    motionContext.add("(prefers-reduced-motion: no-preference)", () => {
      const transition = gsap.timeline({
        scrollTrigger: {
          trigger: hero,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.8,
          invalidateOnRefresh: true,
        },
      });

      transition
        .to(art, {
          scale: 2.6,
          y: () => window.innerHeight * 0.34,
          opacity: 0,
          transformOrigin: () => window.innerWidth <= 720 ? "64% 49%" : "62% 49%",
          ease: "none",
          duration: 1,
        }, 0)
        .to(copy, {
          opacity: 0,
          ease: "none",
          duration: 0.34,
        }, 0.52);
    });

    return () => {
      motionContext.revert();
      intersectionObserver.disconnect();
      motionPreference.removeEventListener("change", handleMotionChange);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  if (!mount) return null;

  return createPortal(
    <Canvas
      className="three-scene-canvas"
      dpr={[1, 1.5]}
      frameloop={isActive && !document.hidden && !isReducedMotion ? "always" : "demand"}
      gl={{ alpha: true, antialias: true, powerPreference: "low-power" }}
      orthographic
      camera={{ position: [0, 0, 10], zoom: 80, near: 0.1, far: 100 }}
      aria-hidden="true"
    >
      <HeroOrbitalScene reducedMotion={isReducedMotion} />
    </Canvas>,
    mount,
  );
}

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import legacyDocument from "../legacy-site.html?raw";
import HeroExperience from "./HeroExperience";

function LegacySiteContent() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isReady, setIsReady] = useState(false);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) {
      throw new Error("The legacy KAGE ORIGIN content container is unavailable.");
    }

    const parsedDocument = new DOMParser().parseFromString(legacyDocument, "text/html");
    parsedDocument.body.querySelectorAll("script").forEach((script) => script.remove());
    parsedDocument.body.querySelector(".framework-section")?.remove();
    parsedDocument.body.querySelectorAll('a[href="#frameworks"]').forEach((link) => link.remove());
    container.innerHTML = parsedDocument.body.innerHTML;
    setIsReady(true);
  }, []);

  useEffect(() => {
    if (!isReady) return;

    import("../main.js").catch((error: unknown) => {
      console.error("Unable to initialize existing KAGE ORIGIN interactions.", error);
    });
  }, [isReady]);

  return (
    <>
      <div ref={containerRef} className="min-h-screen" />
      {isReady && <HeroExperience />}
    </>
  );
}

export default function App() {
  return <LegacySiteContent />;
}

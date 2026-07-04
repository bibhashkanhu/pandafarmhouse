import React, { useEffect, useRef } from "react";
import { ArrowRight, MapPin } from "lucide-react";
import { FARM } from "@/constants/testIds";
import { FARM_PHOTOS } from "@/constants/farmPhotos";

const HERO_BG = FARM_PHOTOS.farmFieldsWaterTank;

const Hero = () => {
  const bgRef = useRef(null);

  useEffect(() => {
    const el = bgRef.current;
    if (!el) return;
    const onScroll = () => {
      const y = window.scrollY;
      el.style.transform = `translate3d(0, ${y * 0.35}px, 0) scale(1.08)`;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="home"
      data-testid={FARM.heroSection}
      className="relative min-h-[100svh] w-full overflow-hidden"
    >
      {/* Parallax background */}
      <div
        ref={bgRef}
        className="absolute inset-0 will-change-transform animate-kenburns"
        style={{
          backgroundImage: `url('${HERO_BG}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/10" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#1A2E1A]/70 via-transparent to-transparent" />
      <div className="absolute inset-0 grain-overlay" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 min-h-[100svh] flex flex-col justify-end pb-16 md:pb-24 pt-32">
        <div className="max-w-4xl reveal-up">
          <div className="inline-flex items-center gap-2 glass-dark text-white/90 rounded-full px-4 py-2 text-xs tracking-[0.28em] uppercase">
            <MapPin className="h-3.5 w-3.5 text-[#FBC02D]" />
            Banaparia · Balasore · Odisha 756056
          </div>

          <h1 className="mt-6 font-serif-display text-white text-5xl sm:text-6xl md:text-7xl lg:text-[92px] leading-[0.95] tracking-tight">
            Fresh From Nature,
            <br />
            <span className="italic text-[#FBC02D]">Delivered</span> With Trust.
          </h1>

          <p className="mt-6 max-w-2xl text-white/85 text-base md:text-lg leading-relaxed font-light">
            Experience sustainable farming with fresh fish, organic vegetables,
            oyster mushrooms, and ethically raised poultry — grown with care at
            Panda Farm House and delivered straight from our soil to your table.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <button
              data-testid={FARM.heroCtaContact}
              onClick={() => go("contact")}
              className="group inline-flex items-center gap-3 bg-[#FBC02D] text-[#1A2E1A] pl-7 pr-3 py-3 rounded-full font-medium tracking-wide hover:bg-white transition-colors shadow-xl"
            >
              Contact Us
              <span className="grid place-items-center h-9 w-9 rounded-full bg-[#1A2E1A] text-white group-hover:translate-x-1 transition-transform">
                <ArrowRight className="h-4 w-4" />
              </span>
            </button>
            <button
              data-testid={FARM.heroCtaVisit}
              onClick={() => go("visit")}
              className="inline-flex items-center gap-2 border border-white/50 text-white px-7 py-4 rounded-full hover:bg-white hover:text-[#1A2E1A] transition-colors backdrop-blur-md"
            >
              Visit Farm
            </button>
          </div>
        </div>

        {/* Bottom stats strip */}
        <div className="mt-14 md:mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10">
          {[
            ["10+", "Years of care"],
            ["4.5+", "Acres of land"],
            ["4", "Farming verticals"],
            ["4.8", "Google rating"],
          ].map(([k, v]) => (
            <div key={v} className="glass-dark rounded-2xl px-5 py-4 text-white">
              <div className="font-serif-display text-3xl md:text-4xl text-[#FBC02D]">{k}</div>
              <div className="text-xs uppercase tracking-[0.2em] text-white/70 mt-1">{v}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 hidden md:flex flex-col items-center gap-2 text-white/70 animate-bob">
        <span className="text-[10px] tracking-[0.3em] uppercase">Scroll</span>
        <div className="h-8 w-[1px] bg-white/60" />
      </div>
    </section>
  );
};

export default Hero;

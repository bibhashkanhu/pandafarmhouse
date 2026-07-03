import React, { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { FARM } from "@/constants/testIds";

const stats = [
  { value: 500, suffix: "+", label: "Happy Customers", decimals: 0 },
  { value: 4.5, suffix: "+", label: "Acres of Farming", decimals: 1 },
  { value: 100, suffix: "%", label: "Organic Practices", decimals: 0 },
  { value: 10,  suffix: "+", label: "Years of Experience", decimals: 0 },
];

const Counter = ({ value, suffix, decimals = 0, active }) => {
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!active) return;
    let raf = 0;
    const start = performance.now();
    const duration = 1600;
    const tick = (t) => {
      const p = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      const current = value * eased;
      setN(decimals > 0 ? Number(current.toFixed(decimals)) : Math.round(current));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, value, decimals]);

  const display = decimals > 0 ? n.toFixed(decimals) : n;
  return (
    <span className="font-serif-display text-6xl md:text-7xl lg:text-8xl text-gradient-forest tracking-tight">
      {display}
      {suffix}
    </span>
  );
};

const Stats = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      data-testid={FARM.statsSection}
      className="relative py-24 md:py-32 bg-gradient-to-br from-[#F4F1EA] via-[#FDFBF7] to-[#F4F1EA] overflow-hidden"
    >
      <div className="absolute inset-0 grain-overlay" />
      <div className="max-w-7xl mx-auto px-6 md:px-10 relative">
        <div className="max-w-2xl mb-14">
          <div className="text-sm uppercase tracking-[0.28em] text-[#2E7D32]">
            By The Numbers
          </div>
          <h2 className="mt-4 font-serif-display text-4xl sm:text-5xl md:text-6xl leading-[1.02] tracking-tight text-[#1A2E1A]">
            A decade of quiet, consistent work.
          </h2>
        </div>

        <div ref={ref} className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
              className="rounded-2xl bg-white/70 backdrop-blur-md border border-white/60 p-6 md:p-8"
            >
              <Counter value={s.value} suffix={s.suffix} decimals={s.decimals} active={inView} />
              <div className="mt-3 text-xs md:text-sm uppercase tracking-[0.28em] text-[#6D4C41]">
                {s.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;

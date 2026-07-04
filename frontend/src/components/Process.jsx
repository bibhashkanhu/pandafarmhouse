import React from "react";
import { motion } from "framer-motion";
import { Sprout, Sun, Wheat, Truck } from "lucide-react";

const steps = [
  {
    icon: Sprout,
    title: "Seed",
    desc: "Native and heirloom varieties sourced from trusted regional cooperatives.",
  },
  {
    icon: Sun,
    title: "Grow",
    desc: "Sunlight, rainwater harvesting and composted soil — no shortcuts, no chemicals.",
  },
  {
    icon: Wheat,
    title: "Harvest",
    desc: "Picked, netted or gathered at peak ripeness by our on-farm team.",
  },
  {
    icon: Truck,
    title: "Deliver",
    desc: "Packed the same day and shipped fresh to your home, kitchen or store.",
  },
];

const Process = () => (
  <section className="relative py-24 md:py-32 bg-[#FDFBF7]">
    <div className="max-w-7xl mx-auto px-6 md:px-10">
      <div className="max-w-3xl">
        <div className="text-sm uppercase tracking-[0.28em] text-[#2E7D32]">
          Our Farming Process
        </div>
        <h2 className="mt-4 font-serif-display text-4xl sm:text-5xl md:text-6xl leading-[1.02] tracking-tight text-[#1A2E1A]">
          From seed to supper — <em className="text-[#2E7D32]">four</em> honest steps.
        </h2>
      </div>

      <div className="mt-16 relative">
        {/* Timeline line (desktop) */}
        <div className="hidden md:block absolute left-0 right-0 top-[64px] h-[1px] bg-gradient-to-r from-transparent via-[#2E7D32]/40 to-transparent" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-6">
          {steps.map(({ icon: Icon, title, desc }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6, delay: i * 0.12 }}
              className="relative"
            >
              <div className="flex md:block items-center gap-5">
                <div className="relative z-10 h-16 w-16 md:h-[128px] md:w-[128px] rounded-full bg-white border border-[#E5E0D8] grid place-items-center shadow-lg">
                  <Icon className="h-6 w-6 md:h-10 md:w-10 text-[#2E7D32]" />
                </div>
                <div className="md:mt-6">
                  <div className="text-xs uppercase tracking-[0.28em] text-[#6D4C41]">
                    Step 0{i + 1}
                  </div>
                  <div className="font-serif-display text-3xl md:text-4xl text-[#1A2E1A] mt-1">
                    {title}
                  </div>
                </div>
              </div>
              <p className="mt-4 text-[#6D4C41] font-light leading-relaxed max-w-xs">
                {desc}
              </p>
              {/* Arrow between steps (mobile) */}
              {i < steps.length - 1 && (
                <div className="md:hidden mt-6 ml-8 h-8 w-[1px] bg-[#2E7D32]/40" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default Process;

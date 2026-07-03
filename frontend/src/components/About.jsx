import React from "react";
import { motion } from "framer-motion";
import { Sprout, Leaf, HeartHandshake, ShieldCheck, Users, BadgeCheck } from "lucide-react";

const ABOUT_IMG =
  "https://images.unsplash.com/photo-1551649001-7a2482d98d05?auto=format&fit=crop&w=1400&q=80";

const highlights = [
  { icon: Sprout,        title: "Fresh Produce" },
  { icon: Leaf,          title: "Sustainable Farming" },
  { icon: Users,         title: "Local Farmers" },
  { icon: HeartHandshake, title: "Healthy Food" },
  { icon: ShieldCheck,   title: "Quality Assurance" },
  { icon: BadgeCheck,    title: "Trusted Brand" },
];

const About = () => {
  return (
    <section id="about" className="relative py-24 md:py-32 bg-[#FDFBF7]">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Image column */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-6 relative"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <img
                src={ABOUT_IMG}
                alt="Farmer holding fresh harvest at Panda Farm House"
                className="w-full h-[520px] md:h-[620px] object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </div>
            {/* Floating badge */}
            <div className="absolute -bottom-8 -right-4 md:-right-10 max-w-[240px] glass rounded-2xl p-5 shadow-2xl">
              <div className="text-[10px] uppercase tracking-[0.28em] text-[#2E7D32] mb-1">Est.</div>
              <div className="font-serif-display text-4xl leading-none text-[#1A2E1A]">2014</div>
              <div className="text-xs text-[#6D4C41] mt-2 leading-relaxed">
                A decade of clean, honest farming for our community.
              </div>
            </div>
          </motion.div>

          {/* Text column */}
          <div className="lg:col-span-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.8 }}
            >
              <div className="text-sm uppercase tracking-[0.28em] text-[#2E7D32]">About Us</div>
              <h2 className="mt-4 font-serif-display text-4xl sm:text-5xl md:text-6xl leading-[1.02] tracking-tight text-[#1A2E1A]">
                A family-owned farm,
                <br />
                grown with <em className="text-[#2E7D32]">patience</em>.
              </h2>
              <p className="mt-6 text-[#6D4C41] text-base md:text-lg leading-relaxed font-light max-w-xl">
                Panda Farm House is a sustainable farm nestled in the coastal
                belt of Balasore, Odisha. For over a decade we have worked with
                nature — not against it — to produce fresh fish, seasonal
                organic vegetables, oyster mushrooms and free-range poultry for
                homes, restaurants and wholesalers across the region.
              </p>
              <p className="mt-4 text-[#6D4C41] text-base md:text-lg leading-relaxed font-light max-w-xl">
                We believe good food starts with good soil, clean water, and
                farmers who care. Every crate that leaves our farm carries that
                promise.
              </p>

              <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 gap-4">
                {highlights.map(({ icon: Icon, title }, i) => (
                  <motion.div
                    key={title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.06 }}
                    className="flex items-start gap-3 rounded-xl bg-white border border-[#E5E0D8] p-4 hover:border-[#2E7D32]/50 hover:-translate-y-0.5 transition-all"
                  >
                    <div className="grid place-items-center h-9 w-9 rounded-lg bg-[#F4F1EA] text-[#2E7D32]">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="text-sm text-[#1A2E1A] leading-tight pt-1">{title}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;

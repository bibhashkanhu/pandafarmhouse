import React from "react";
import { motion } from "framer-motion";
import {
  Sun,
  Leaf,
  FlaskConical,
  Recycle,
  Feather,
  Wallet,
  Heart,
  ShieldCheck,
} from "lucide-react";

const items = [
  { icon: Sun,          title: "Fresh Daily",         desc: "Harvested at dawn, delivered by evening." },
  { icon: Leaf,         title: "100% Natural",        desc: "No hormones, no shortcuts, no compromise." },
  { icon: FlaskConical, title: "Chemical Free",       desc: "Grown with compost and clean water only." },
  { icon: Recycle,      title: "Eco Friendly",        desc: "Circular practices — waste becomes feed." },
  { icon: Feather,      title: "Healthy Livestock",   desc: "Ethically raised, veterinary supervised." },
  { icon: Wallet,       title: "Affordable Prices",   desc: "Farm-direct pricing without middlemen." },
  { icon: Heart,        title: "Trusted by Customers", desc: "Rated 4.8/5 across 13+ Google reviews." },
  { icon: ShieldCheck,  title: "Quality Assured",     desc: "Every batch inspected before dispatch." },
];

const WhyChooseUs = () => (
  <section className="relative py-24 md:py-32 bg-[#FDFBF7]">
    <div className="max-w-7xl mx-auto px-6 md:px-10">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div className="max-w-2xl">
          <div className="text-sm uppercase tracking-[0.28em] text-[#2E7D32]">
            Why Choose Us
          </div>
          <h2 className="mt-4 font-serif-display text-4xl sm:text-5xl md:text-6xl leading-[1.05] tracking-tight text-[#1A2E1A]">
            Small farm principles.<br />Big-farm reliability.
          </h2>
        </div>
        <p className="max-w-md text-[#6D4C41] font-light leading-relaxed">
          Eight reasons families, restaurants and wholesalers keep coming back
          to Panda Farm House — season after season.
        </p>
      </div>

      <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {items.map(({ icon: Icon, title, desc }, i) => (
          <motion.div
            key={title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.55, delay: i * 0.05 }}
            className="group relative rounded-2xl bg-white border border-[#E5E0D8] p-6 md:p-7 hover:-translate-y-1 hover:shadow-xl hover:border-[#2E7D32]/40 transition-all"
          >
            <div className="h-12 w-12 grid place-items-center rounded-xl bg-[#F4F1EA] group-hover:bg-[#2E7D32] transition-colors">
              <Icon className="h-5 w-5 text-[#2E7D32] group-hover:text-white transition-colors" />
            </div>
            <div className="mt-5 font-serif-display text-xl md:text-2xl text-[#1A2E1A]">
              {title}
            </div>
            <p className="mt-2 text-sm text-[#6D4C41] leading-relaxed font-light">
              {desc}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default WhyChooseUs;

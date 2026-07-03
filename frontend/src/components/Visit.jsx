import React from "react";
import { motion } from "framer-motion";
import { MapPin, Phone, Clock, Navigation } from "lucide-react";
import { FARM } from "@/constants/testIds";

const MAP_SRC =
  "https://www.google.com/maps?q=" +
  encodeURIComponent("Banaparia, Balasore, Odisha 756056") +
  "&z=13&output=embed";

const Visit = () => (
  <section
    id="visit"
    data-testid={FARM.visitSection}
    className="relative py-24 md:py-32 bg-[#FDFBF7]"
  >
    <div className="max-w-7xl mx-auto px-6 md:px-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="lg:col-span-5"
        >
          <div className="text-sm uppercase tracking-[0.28em] text-[#2E7D32]">
            Visit Our Farm
          </div>
          <h2 className="mt-4 font-serif-display text-4xl sm:text-5xl md:text-6xl leading-[1.02] tracking-tight text-[#1A2E1A]">
            Come see how your food is grown.
          </h2>
          <p className="mt-6 text-[#6D4C41] font-light leading-relaxed">
            Walk our fields, meet our team, and (if the season allows) taste
            something straight off the plant. We welcome families, food
            enthusiasts, and business partners by prior appointment.
          </p>

          <div className="mt-10 space-y-5">
            <div className="flex items-start gap-4 rounded-2xl bg-white border border-[#E5E0D8] p-5">
              <div className="h-11 w-11 grid place-items-center rounded-xl bg-[#F4F1EA] text-[#2E7D32]">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xs uppercase tracking-[0.28em] text-[#6D4C41]">Address</div>
                <div className="mt-1 text-[#1A2E1A]">
                  Banaparia, Balasore, Odisha – 756056
                </div>
                <a
                  href="https://www.google.com/maps/search/?api=1&query=Banaparia%2C+Balasore%2C+Odisha+756056"
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 inline-flex items-center gap-1 text-sm text-[#2E7D32] hover:underline"
                >
                  Get directions <Navigation className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4 rounded-2xl bg-white border border-[#E5E0D8] p-5">
              <div className="h-11 w-11 grid place-items-center rounded-xl bg-[#F4F1EA] text-[#2E7D32]">
                <Phone className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xs uppercase tracking-[0.28em] text-[#6D4C41]">Phone</div>
                <a href="tel:+919861448443" className="mt-1 block text-[#1A2E1A] hover:text-[#2E7D32]">
                  +91 98614 48443
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4 rounded-2xl bg-white border border-[#E5E0D8] p-5">
              <div className="h-11 w-11 grid place-items-center rounded-xl bg-[#F4F1EA] text-[#2E7D32]">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xs uppercase tracking-[0.28em] text-[#6D4C41]">Business Hours</div>
                <div className="mt-1 text-[#1A2E1A]">7:00 AM – 6:00 PM · All days</div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="lg:col-span-7"
        >
          <div className="relative rounded-3xl overflow-hidden border border-[#E5E0D8] shadow-2xl">
            <iframe
              title="Panda Farm House on Google Maps"
              src={MAP_SRC}
              width="100%"
              height="560"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-[420px] md:h-[560px] block"
            />
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);

export default Visit;

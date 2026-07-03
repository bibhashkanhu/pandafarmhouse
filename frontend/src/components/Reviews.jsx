import React from "react";
import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { FARM } from "@/constants/testIds";

const testimonials = [
  {
    name: "Ritwik Sahoo",
    role: "Visitor · Balasore",
    stars: 5,
    text: "Such a beautiful and fantastic place. Everything grown here feels alive — you can tell the difference the moment you taste it.",
  },
  {
    name: "Priya Mohanty",
    role: "Customer · Bhubaneswar",
    stars: 5,
    text: "Good environment and good location. Their vegetables and fresh fish are consistently the best I have bought in years.",
  },
  {
    name: "Anil Behera",
    role: "Restaurant Owner",
    stars: 5,
    text: "A wonderful place for enjoyment and business alike. Reliable supply, honest people, and produce that our chefs love working with.",
  },
];

const GoogleG = () => (
  <svg viewBox="0 0 48 48" className="h-6 w-6" aria-hidden="true">
    <path fill="#EA4335" d="M24 9.5c3.9 0 6.6 1.7 8.1 3.1l5.9-5.9C34.6 3 29.9 1 24 1 14.9 1 7.1 6.2 3.3 13.7l6.9 5.4C12 13.6 17.5 9.5 24 9.5z" />
    <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.2-.4-4.7H24v9h12.7c-.6 3-2.4 5.5-5 7.2l7.7 6c4.5-4.2 7.1-10.3 7.1-17.5z" />
    <path fill="#FBBC05" d="M10.2 28.9A14.5 14.5 0 0 1 9.5 24c0-1.7.3-3.3.7-4.9l-6.9-5.4A24 24 0 0 0 0 24c0 3.8.9 7.4 2.6 10.6l7.6-5.7z" />
    <path fill="#34A853" d="M24 47c6.5 0 11.9-2.2 15.8-5.9l-7.7-6c-2.1 1.4-4.8 2.3-8.1 2.3-6.5 0-12-4.1-14-9.6l-7.6 5.7C7 41.8 14.9 47 24 47z" />
  </svg>
);

const Reviews = () => (
  <section
    id="reviews"
    data-testid={FARM.reviewsSection}
    className="relative py-24 md:py-32 bg-[#F4F1EA]"
  >
    <div className="max-w-7xl mx-auto px-6 md:px-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Rating card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="lg:col-span-4 lg:sticky lg:top-28"
        >
          <div className="rounded-3xl bg-white border border-[#E5E0D8] p-8 shadow-lg">
            <div className="flex items-center gap-3">
              <GoogleG />
              <span className="text-sm tracking-[0.2em] uppercase text-[#6D4C41]">
                Google Reviews
              </span>
            </div>
            <div className="mt-6 flex items-baseline gap-2">
              <span className="font-serif-display text-6xl md:text-7xl text-[#1A2E1A]">4.8</span>
              <span className="text-[#6D4C41]">/5</span>
            </div>
            <div className="mt-2 flex items-center gap-1 text-[#FBC02D]">
              {[0, 1, 2, 3, 4].map((i) => (
                <Star key={i} className="h-5 w-5 fill-current" />
              ))}
              <span className="ml-3 text-sm text-[#6D4C41]">based on 13+ reviews</span>
            </div>
            <p className="mt-6 text-[#6D4C41] font-light leading-relaxed">
              Our visitors, families and business partners rate us for the
              quality of produce, the calm of our farm, and the trust we build
              in every transaction.
            </p>
          </div>
        </motion.div>

        {/* Testimonials */}
        <div className="lg:col-span-8">
          <div className="text-sm uppercase tracking-[0.28em] text-[#2E7D32]">
            Customer Reviews
          </div>
          <h2 className="mt-4 font-serif-display text-4xl sm:text-5xl md:text-6xl leading-[1.02] tracking-tight text-[#1A2E1A]">
            Words from those who have visited.
          </h2>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
            {testimonials.map((t, i) => (
              <motion.article
                key={t.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className={`relative rounded-2xl bg-white border border-[#E5E0D8] p-7 hover:-translate-y-1 hover:shadow-xl transition-all ${
                  i === 0 ? "md:col-span-2" : ""
                }`}
              >
                <Quote className="h-8 w-8 text-[#FBC02D]/60" />
                <p className="mt-4 text-[#1A2E1A] text-lg md:text-xl leading-relaxed font-light">
                  “{t.text}”
                </p>
                <div className="mt-6 flex items-center justify-between">
                  <div>
                    <div className="text-[#1A2E1A] font-medium">{t.name}</div>
                    <div className="text-xs uppercase tracking-[0.24em] text-[#6D4C41] mt-1">
                      {t.role}
                    </div>
                  </div>
                  <div className="flex items-center gap-0.5 text-[#FBC02D]">
                    {Array.from({ length: t.stars }).map((_, si) => (
                      <Star key={si} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default Reviews;

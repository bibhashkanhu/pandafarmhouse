import React from "react";
import { motion } from "framer-motion";
import { PartyPopper, Cake, Users2, Utensils, ArrowRight, Sparkles } from "lucide-react";
import { FARM } from "@/constants/testIds";

const EVENT_IMG =
  "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=1600&q=80";
const EVENT_IMG_2 =
  "https://images.unsplash.com/photo-1467810563316-b5476525c0f9?auto=format&fit=crop&w=1200&q=80";

const events = [
  {
    icon: Utensils,
    title: "Year-End Feast",
    desc: "Close the year around a long farm table with a farm-to-plate menu curated by our kitchen.",
  },
  {
    icon: Users2,
    title: "Family Get-Together",
    desc: "Reunions, anniversaries and weekend gatherings against the calm of open fields.",
  },
  {
    icon: Cake,
    title: "Birthday Celebrations",
    desc: "Intimate birthdays with clean air, bonfires and freshly cooked seasonal fare.",
  },
  {
    icon: PartyPopper,
    title: "Small Private Events",
    desc: "Baby showers, engagement lunches, corporate off-sites and any small, meaningful moment.",
  },
];

const scrollToContact = () => {
  const el = document.getElementById("contact");
  if (el) el.scrollIntoView({ behavior: "smooth" });
};

const Events = () => (
  <section
    id="events"
    data-testid="events-section"
    className="relative py-24 md:py-32 bg-[#1A2E1A] text-white overflow-hidden"
  >
    {/* Decorative glows */}
    <div className="absolute -top-24 -left-20 h-72 w-72 rounded-full bg-[#2E7D32]/40 blur-3xl" />
    <div className="absolute -bottom-24 -right-20 h-80 w-80 rounded-full bg-[#FBC02D]/15 blur-3xl" />
    <div className="absolute inset-0 grain-overlay opacity-40" />

    <div className="max-w-7xl mx-auto px-6 md:px-10 relative">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Copy */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7 }}
          className="lg:col-span-6"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-[#FBC02D]/40 bg-[#FBC02D]/10 px-4 py-1.5 text-xs uppercase tracking-[0.28em] text-[#FBC02D]">
            <Sparkles className="h-3.5 w-3.5" />
            Book the Farmhouse
          </div>
          <h2 className="mt-6 font-serif-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.02] tracking-tight text-white">
            Host your moment,
            <br />
            <em className="text-[#FBC02D]">under our sky</em>.
          </h2>
          <p className="mt-6 max-w-xl text-white/80 font-light leading-relaxed">
            Reserve Panda Farm House for your special occasion — a year-end
            feast, a family get-together, a birthday, or any small private
            event. Long tables, open fields, honest food from our own soil, and
            a team that treats your day like our own.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <button
              data-testid="events-book-cta"
              onClick={scrollToContact}
              className="group inline-flex items-center gap-3 bg-[#FBC02D] text-[#1A2E1A] pl-7 pr-3 py-3 rounded-full font-medium tracking-wide hover:bg-white transition-colors shadow-xl"
            >
              Enquire to Book
              <span className="grid place-items-center h-9 w-9 rounded-full bg-[#1A2E1A] text-[#FBC02D] group-hover:translate-x-1 transition-transform">
                <ArrowRight className="h-4 w-4" />
              </span>
            </button>
            <a
              href="https://wa.me/918328830796?text=Hi%20Panda%20Farm%20House%2C%20I%27d%20like%20to%20book%20the%20farm%20for%20an%20event."
              target="_blank"
              rel="noreferrer"
              data-testid="events-whatsapp-cta"
              className="inline-flex items-center gap-2 border border-white/40 text-white px-7 py-4 rounded-full hover:bg-white hover:text-[#1A2E1A] transition-colors"
            >
              Chat on WhatsApp
            </a>
          </div>
        </motion.div>

        {/* Image */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="lg:col-span-6 relative"
        >
          <div className="relative rounded-3xl overflow-hidden shadow-2xl">
            <img
              src={EVENT_IMG}
              alt="Long farm table dinner set under fairy lights at Panda Farm House"
              loading="lazy"
              className="w-full h-[420px] md:h-[520px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-[#1A2E1A]/60 via-transparent to-transparent" />
          </div>
          {/* Small floating image */}
          <div className="hidden md:block absolute -bottom-8 -left-8 w-52 rounded-2xl overflow-hidden border-4 border-[#1A2E1A] shadow-2xl">
            <img
              src={EVENT_IMG_2}
              alt="Bonfire and cozy gathering at the farm"
              loading="lazy"
              className="w-full h-40 object-cover"
            />
          </div>
        </motion.div>
      </div>

      {/* Event type cards */}
      <div className="mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {events.map(({ icon: Icon, title, desc }, i) => (
          <motion.article
            key={title}
            data-testid={`event-card-${i}`}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.55, delay: i * 0.07 }}
            className="group rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 p-6 md:p-7 hover:bg-white/10 hover:border-[#FBC02D]/40 hover:-translate-y-1 transition-all"
          >
            <div className="h-12 w-12 grid place-items-center rounded-xl bg-white/10 group-hover:bg-[#FBC02D] transition-colors">
              <Icon className="h-5 w-5 text-[#FBC02D] group-hover:text-[#1A2E1A] transition-colors" />
            </div>
            <div className="mt-5 font-serif-display text-2xl text-white">{title}</div>
            <p className="mt-3 text-sm text-white/70 leading-relaxed font-light">{desc}</p>
          </motion.article>
        ))}
      </div>

      {/* Details strip */}
      <div className="mt-12 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
        <div className="text-sm md:text-base text-white/85 font-light leading-relaxed max-w-2xl">
          <span className="uppercase tracking-[0.28em] text-[#FBC02D] text-xs">Good to know</span>
          <br />
          Dates are booked on a first-come basis. Custom menus, décor and
          seating (up to a comfortable small-gathering size) can be arranged on
          request. Reach out at least 7 days in advance for the best experience.
        </div>
        <button
          data-testid={FARM.heroCtaContact + "-events"}
          onClick={scrollToContact}
          className="inline-flex items-center gap-2 bg-white text-[#1A2E1A] px-6 py-3 rounded-full font-medium hover:bg-[#FBC02D] transition-colors"
        >
          Check Availability <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  </section>
);

export default Events;

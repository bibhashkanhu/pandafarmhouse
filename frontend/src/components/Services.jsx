import React from "react";
import { motion } from "framer-motion";
import { Fish, Sprout, Egg, Trees } from "lucide-react";
import { FARM } from "@/constants/testIds";
import { FARM_PHOTOS } from "@/constants/farmPhotos";

const services = [
  {
    id: "fish",
    testid: FARM.serviceCardFish,
    title: "Fish Farming",
    tagline: "Freshwater · Clean Water Ponds",
    desc: "Healthy, hormone-free freshwater fish reared in oxygen-rich ponds. Rohu, Katla, Mrigal and more — netted fresh on order.",
    icon: Fish,
    img: FARM_PHOTOS.fishHarvest,
    tone: "from-[#0f5b8a]/60 to-[#0b2e4a]/80",
  },
  {
    id: "vegetables",
    testid: FARM.serviceCardVegetables,
    title: "Organic Vegetables",
    tagline: "Seasonal · Chemical-Free",
    desc: "Bright, seasonal vegetables grown without synthetic pesticides. From leafy greens and gourds to roots and legumes — harvested at peak flavour.",
    icon: Sprout,
    img: "https://images.pexels.com/photos/5425794/pexels-photo-5425794.jpeg?auto=compress&cs=tinysrgb&w=1400",
    tone: "from-[#2E7D32]/75 to-[#1A2E1A]/85",
  },
  {
    id: "mushrooms",
    testid: FARM.serviceCardMushrooms,
    title: "Mushroom Farming",
    tagline: "Oyster & Button · Hygienic",
    desc: "Fresh, nutrient-dense oyster mushrooms cultivated in climate-controlled sheds. Consistent quality, zero chemical treatment.",
    icon: Trees,
    img: "https://images.unsplash.com/photo-1552825898-07e419204683?auto=format&fit=crop&w=1400&q=80",
    tone: "from-[#6D4C41]/75 to-[#1A2E1A]/85",
  },
  {
    id: "poultry",
    testid: FARM.serviceCardPoultry,
    title: "Poultry Farm",
    tagline: "Free-Range · Ethically Raised",
    desc: "Healthy chickens and farm-fresh eggs from birds raised on open land with clean feed, plenty of daylight, and daily veterinary care.",
    icon: Egg,
    img: "https://images.unsplash.com/photo-1606443589134-2c65a11ac828?auto=format&fit=crop&w=1400&q=80",
    tone: "from-[#8B6F47]/75 to-[#1A2E1A]/85",
  },
];

const Services = () => (
  <section
    id="services"
    data-testid={FARM.servicesSection}
    className="relative py-24 md:py-32 bg-[#F4F1EA]"
  >
    <div className="max-w-7xl mx-auto px-6 md:px-10">
      <div className="max-w-3xl">
        <div className="text-sm uppercase tracking-[0.28em] text-[#2E7D32]">Our Services</div>
        <h2 className="mt-4 font-serif-display text-4xl sm:text-5xl md:text-6xl leading-[1.02] tracking-tight text-[#1A2E1A]">
          Four verticals, one uncompromising standard.
        </h2>
        <p className="mt-6 text-[#6D4C41] text-base md:text-lg font-light leading-relaxed">
          Each corner of Panda Farm House is run with the same discipline —
          clean inputs, careful hands, and produce we would proudly serve at
          our own table.
        </p>
      </div>

      <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
        {services.map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.article
              key={s.id}
              data-testid={s.testid}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, delay: i * 0.08 }}
              className="group relative rounded-3xl overflow-hidden bg-white border border-[#E5E0D8] hover:-translate-y-2 hover:shadow-2xl transition-all duration-500"
            >
              <div className="relative h-64 md:h-72 overflow-hidden">
                <img
                  src={s.img}
                  alt={s.title}
                  loading="lazy"
                  className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-[1400ms]"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${s.tone}`} />
                <div className="absolute top-5 left-5 inline-flex items-center gap-2 glass rounded-full px-3 py-1.5 text-xs text-[#1A2E1A]">
                  <Icon className="h-3.5 w-3.5 text-[#2E7D32]" />
                  {s.tagline}
                </div>
                <div className="absolute bottom-5 left-5 right-5">
                  <h3 className="font-serif-display text-3xl md:text-4xl text-white leading-tight">
                    {s.title}
                  </h3>
                </div>
              </div>
              <div className="p-6 md:p-8">
                <p className="text-[#6D4C41] leading-relaxed font-light">{s.desc}</p>
                <div className="mt-6 flex items-center justify-between">
                  <span className="text-xs uppercase tracking-[0.28em] text-[#2E7D32]">
                    Panda Farm House
                  </span>
                  <span className="h-9 w-9 grid place-items-center rounded-full bg-[#F4F1EA] text-[#2E7D32] group-hover:bg-[#2E7D32] group-hover:text-white transition-colors">
                    <Icon className="h-4 w-4" />
                  </span>
                </div>
              </div>
            </motion.article>
          );
        })}
      </div>
    </div>
  </section>
);

export default Services;

import React, { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Camera } from "lucide-react";
import { FARM } from "@/constants/testIds";

const IMAGES = [
  {
    src: "https://images.pexels.com/photos/5078745/pexels-photo-5078745.jpeg?auto=compress&cs=tinysrgb&w=1400",
    alt: "Sunrise over rural farm and farmhouse",
    label: "Farm landscapes",
    h: "tall",
  },
  {
    src: "https://images.unsplash.com/photo-1541441056316-443fff347c40?auto=format&fit=crop&w=1200&q=80",
    alt: "Fresh fish in clear pond",
    label: "Fish ponds",
    h: "short",
  },
  {
    src: "https://images.unsplash.com/photo-1754810940905-19a8d26f870e?auto=format&fit=crop&w=1200&q=80",
    alt: "Rows of cabbage plants at sunrise",
    label: "Vegetable fields",
    h: "mid",
  },
  {
    src: "https://images.unsplash.com/photo-1552825898-07e419204683?auto=format&fit=crop&w=1200&q=80",
    alt: "Cultivated oyster mushrooms",
    label: "Mushrooms",
    h: "tall",
  },
  {
    src: "https://images.unsplash.com/photo-1606443589134-2c65a11ac828?auto=format&fit=crop&w=1200&q=80",
    alt: "Free-range hen on green grass",
    label: "Poultry",
    h: "mid",
  },
  {
    src: "https://images.pexels.com/photos/9117894/pexels-photo-9117894.jpeg?auto=compress&cs=tinysrgb&w=1200",
    alt: "Hands pulling freshly harvested onions",
    label: "Harvest moments",
    h: "short",
  },
  {
    src: "https://images.pexels.com/photos/5425794/pexels-photo-5425794.jpeg?auto=compress&cs=tinysrgb&w=1200",
    alt: "Basket of fresh organic vegetables",
    label: "Fresh produce",
    h: "mid",
  },
  {
    src: "https://images.pexels.com/photos/8477070/pexels-photo-8477070.jpeg?auto=compress&cs=tinysrgb&w=1200",
    alt: "Fresh patty pan squash in rustic kitchen",
    label: "Kitchen ready",
    h: "tall",
  },
  {
    src: "https://images.unsplash.com/photo-1551649001-7a2482d98d05?auto=format&fit=crop&w=1200&q=80",
    alt: "Farmer holding freshly harvested beetroots",
    label: "Farmers working",
    h: "short",
  },
];

const heightClass = (h) =>
  h === "tall" ? "h-[420px] md:h-[520px]" : h === "mid" ? "h-[320px] md:h-[380px]" : "h-[220px] md:h-[260px]";

const Gallery = () => {
  const [openIndex, setOpenIndex] = useState(-1);

  const close = useCallback(() => setOpenIndex(-1), []);
  const prev = useCallback(
    () => setOpenIndex((i) => (i <= 0 ? IMAGES.length - 1 : i - 1)),
    []
  );
  const next = useCallback(
    () => setOpenIndex((i) => (i >= IMAGES.length - 1 ? 0 : i + 1)),
    []
  );

  useEffect(() => {
    if (openIndex === -1) return;
    const onKey = (e) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [openIndex, close, prev, next]);

  return (
    <section
      id="gallery"
      data-testid={FARM.gallerySection}
      className="relative py-24 md:py-32 bg-[#FDFBF7]"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <div className="text-sm uppercase tracking-[0.28em] text-[#2E7D32]">
              Farm Gallery
            </div>
            <h2 className="mt-4 font-serif-display text-4xl sm:text-5xl md:text-6xl leading-[1.02] tracking-tight text-[#1A2E1A]">
              A day in the life of the farm.
            </h2>
          </div>
          <p className="max-w-md text-[#6D4C41] font-light leading-relaxed">
            Peek into our ponds, fields, sheds and coops — click any image to
            see it up close.
          </p>
        </div>

        <div className="masonry">
          {IMAGES.map((img, i) => (
            <motion.button
              key={i}
              data-testid={FARM.galleryItem(i)}
              onClick={() => setOpenIndex(i)}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6, delay: (i % 3) * 0.08 }}
              className={`group block w-full text-left relative rounded-2xl overflow-hidden ${heightClass(
                img.h
              )} bg-[#F4F1EA]`}
              aria-label={`Open ${img.alt}`}
            >
              <img
                src={img.src}
                alt={img.alt}
                loading="lazy"
                className="h-full w-full object-cover brightness-95 group-hover:brightness-100 group-hover:scale-[1.06] transition-all duration-[1200ms]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1A2E1A]/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-500 text-white">
                <span className="text-sm tracking-wide">{img.label}</span>
                <span className="h-9 w-9 grid place-items-center rounded-full glass text-[#1A2E1A]">
                  <Camera className="h-4 w-4" />
                </span>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {openIndex >= 0 && (
        <div
          data-testid={FARM.lightbox}
          className="fixed inset-0 z-[70] bg-[#1A2E1A]/95 backdrop-blur-xl flex items-center justify-center p-4"
          onClick={close}
          role="dialog"
          aria-modal="true"
        >
          <button
            data-testid={FARM.lightboxClose}
            onClick={close}
            className="absolute top-6 right-6 h-11 w-11 grid place-items-center rounded-full bg-white/10 hover:bg-white/20 text-white"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
          <button
            data-testid={FARM.lightboxPrev}
            onClick={(e) => { e.stopPropagation(); prev(); }}
            className="absolute left-4 md:left-8 h-12 w-12 grid place-items-center rounded-full bg-white/10 hover:bg-white/20 text-white"
            aria-label="Previous"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            data-testid={FARM.lightboxNext}
            onClick={(e) => { e.stopPropagation(); next(); }}
            className="absolute right-4 md:right-8 h-12 w-12 grid place-items-center rounded-full bg-white/10 hover:bg-white/20 text-white"
            aria-label="Next"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          <figure onClick={(e) => e.stopPropagation()} className="max-w-6xl w-full">
            <img
              src={IMAGES[openIndex].src}
              alt={IMAGES[openIndex].alt}
              className="w-full max-h-[80vh] object-contain rounded-xl"
            />
            <figcaption className="mt-4 text-center text-white/80 text-sm tracking-wide">
              {IMAGES[openIndex].alt}
            </figcaption>
          </figure>
        </div>
      )}
    </section>
  );
};

export default Gallery;

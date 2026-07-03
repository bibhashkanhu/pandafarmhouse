import React from "react";
import { Facebook, Instagram, Youtube, Phone, Mail, MapPin } from "lucide-react";
import { Logo } from "@/components/Logo";
import { FARM } from "@/constants/testIds";

const quickLinks = [
  { label: "Home", id: "home" },
  { label: "About Us", id: "about" },
  { label: "Services", id: "services" },
  { label: "Gallery", id: "gallery" },
  { label: "Events", id: "events" },
  { label: "Reviews", id: "reviews" },
  { label: "Contact", id: "contact" },
];

const services = [
  "Fish Farming",
  "Organic Vegetables",
  "Mushroom Farming",
  "Poultry Farm",
];

const go = (id) => {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth" });
};

const Footer = () => (
  <footer
    data-testid={FARM.footer}
    className="relative bg-[#1A2E1A] text-white/85 pt-20 pb-8 overflow-hidden"
  >
    <div className="absolute inset-0 grain-overlay opacity-40" />
    <div className="absolute -top-24 -right-20 h-72 w-72 rounded-full bg-[#2E7D32]/40 blur-3xl" />
    <div className="absolute -bottom-24 -left-20 h-80 w-80 rounded-full bg-[#FBC02D]/10 blur-3xl" />

    <div className="max-w-7xl mx-auto px-6 md:px-10 relative">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        {/* Brand */}
        <div className="lg:col-span-1">
          <div className="text-white">
            <div className="[&_span]:text-white [&_svg]:text-[#FBC02D]">
              <Logo />
            </div>
          </div>
          <p className="mt-5 text-sm text-white/70 leading-relaxed font-light max-w-xs">
            A family-owned sustainable farm in Balasore, Odisha — producing
            fish, organic vegetables, mushrooms and poultry since 2014.
          </p>
          <div className="mt-6 flex gap-3">
            {[Facebook, Instagram, Youtube].map((Icon, i) => (
              <a
                key={i}
                href="#"
                aria-label="social"
                className="h-10 w-10 grid place-items-center rounded-full border border-white/15 hover:border-[#FBC02D] hover:bg-[#FBC02D] hover:text-[#1A2E1A] transition-colors"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        {/* Quick links */}
        <div>
          <div className="text-xs uppercase tracking-[0.28em] text-[#FBC02D]">
            Quick Links
          </div>
          <ul className="mt-5 space-y-3">
            {quickLinks.map((l) => (
              <li key={l.id}>
                <button
                  onClick={() => go(l.id)}
                  className="text-white/75 hover:text-white link-underline"
                >
                  {l.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Services */}
        <div>
          <div className="text-xs uppercase tracking-[0.28em] text-[#FBC02D]">
            Services
          </div>
          <ul className="mt-5 space-y-3">
            {services.map((s) => (
              <li key={s} className="text-white/75">{s}</li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <div className="text-xs uppercase tracking-[0.28em] text-[#FBC02D]">
            Reach Us
          </div>
          <ul className="mt-5 space-y-4 text-sm">
            <li className="flex items-start gap-3">
              <MapPin className="h-4 w-4 mt-0.5 text-[#FBC02D]" />
              <span className="text-white/80">Banaparia, Balasore,<br />Odisha – 756056</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-[#FBC02D]" />
              <a href="tel:+919861448443" className="text-white/80 hover:text-white">+91 98614 48443</a>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-[#FBC02D]" />
              <a href="mailto:lumenxo70@gmail.com" className="text-white/80 hover:text-white">
                lumenxo70@gmail.com
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-14 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/50">
        <div>© {new Date().getFullYear()} Panda Farm House. All rights reserved.</div>
        <div className="flex items-center gap-4">
          <span>Made with care in Balasore, Odisha</span>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;

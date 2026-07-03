import React, { useEffect, useState } from "react";
import { Menu, X, Leaf } from "lucide-react";
import { FARM } from "@/constants/testIds";
import { Logo } from "@/components/Logo";

const links = [
  { id: "home", label: "Home", testid: FARM.navLinkHome },
  { id: "about", label: "About", testid: FARM.navLinkAbout },
  { id: "services", label: "Services", testid: FARM.navLinkServices },
  { id: "gallery", label: "Gallery", testid: FARM.navLinkGallery },
  { id: "visit", label: "Visit", testid: FARM.navLinkVisit },
  { id: "contact", label: "Contact", testid: FARM.navLinkContact },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (id) => {
    setOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled
          ? "py-3 glass shadow-[0_6px_28px_-14px_rgba(26,46,26,0.35)]"
          : "py-5 bg-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-6 md:px-10 flex items-center justify-between">
        <button
          onClick={() => go("home")}
          data-testid={FARM.navLogo}
          className="flex items-center focus:outline-none"
          aria-label="Panda Farm House Home"
        >
          <Logo compact={scrolled} />
        </button>

        {/* Desktop links */}
        <ul className="hidden lg:flex items-center gap-9">
          {links.map((l) => (
            <li key={l.id}>
              <button
                data-testid={l.testid}
                onClick={() => go(l.id)}
                className="link-underline text-sm tracking-wide text-[#1A2E1A] hover:text-[#2E7D32] transition-colors"
              >
                {l.label}
              </button>
            </li>
          ))}
        </ul>

        <div className="hidden lg:flex">
          <button
            data-testid={FARM.navCtaVisit}
            onClick={() => go("contact")}
            className="inline-flex items-center gap-2 bg-[#2E7D32] text-white px-6 py-3 rounded-full text-sm tracking-wide hover:bg-[#1A2E1A] transition-colors shadow-lg hover:shadow-xl"
          >
            <Leaf className="h-4 w-4" />
            Visit Us
          </button>
        </div>

        {/* Mobile toggle */}
        <button
          data-testid={FARM.navMobileToggle}
          className="lg:hidden p-2 rounded-full glass"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {/* Mobile menu */}
      <div
        className={`lg:hidden overflow-hidden transition-[max-height,opacity] duration-500 ${
          open ? "max-h-[520px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="mx-6 mt-3 rounded-2xl glass p-6">
          <ul className="flex flex-col gap-4">
            {links.map((l) => (
              <li key={l.id}>
                <button
                  onClick={() => go(l.id)}
                  className="w-full text-left text-base text-[#1A2E1A] hover:text-[#2E7D32]"
                >
                  {l.label}
                </button>
              </li>
            ))}
            <li>
              <button
                onClick={() => go("contact")}
                className="mt-2 w-full inline-flex items-center justify-center gap-2 bg-[#2E7D32] text-white px-6 py-3 rounded-full text-sm hover:bg-[#1A2E1A] transition-colors"
              >
                <Leaf className="h-4 w-4" /> Visit Us
              </button>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

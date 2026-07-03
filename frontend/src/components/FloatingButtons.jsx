import React, { useEffect, useState } from "react";
import { Phone, ArrowUp, MessageCircle } from "lucide-react";
import { FARM } from "@/constants/testIds";

const WHATSAPP_NUMBER = "918328830796"; // country code + number, no plus/spaces
const CALL_NUMBER = "+919861448443";

const FloatingButtons = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 500);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* WhatsApp */}
      <a
        data-testid={FARM.floatWhatsapp}
        href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
          "Hello Panda Farm House, I have an inquiry."
        )}`}
        target="_blank"
        rel="noreferrer"
        aria-label="Chat on WhatsApp"
        className="fixed bottom-6 right-6 z-40 h-14 w-14 rounded-full bg-[#25D366] text-white grid place-items-center shadow-2xl hover:scale-110 transition-transform"
      >
        <MessageCircle className="h-6 w-6" />
        <span className="absolute inset-0 rounded-full animate-ping bg-[#25D366]/40" />
      </a>

      {/* Call */}
      <a
        data-testid={FARM.floatCall}
        href={`tel:${CALL_NUMBER}`}
        aria-label="Call Panda Farm House"
        className="fixed bottom-24 right-6 z-40 h-12 w-12 rounded-full bg-[#2E7D32] text-white grid place-items-center shadow-xl hover:bg-[#1A2E1A] transition-colors"
      >
        <Phone className="h-5 w-5" />
      </a>

      {/* Back to top */}
      <button
        data-testid={FARM.floatBackTop}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Back to top"
        className={`fixed bottom-6 left-6 z-40 h-12 w-12 rounded-full bg-white text-[#1A2E1A] border border-[#E5E0D8] shadow-lg hover:bg-[#F4F1EA] grid place-items-center transition-all duration-500 ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
        }`}
      >
        <ArrowUp className="h-5 w-5" />
      </button>
    </>
  );
};

export default FloatingButtons;

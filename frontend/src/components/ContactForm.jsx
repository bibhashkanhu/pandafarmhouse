import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Send, Sparkles, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { FARM } from "@/constants/testIds";

const API = (process.env.REACT_APP_BACKEND_URL || "").replace(/\/$/, "") + "/api";

const initialForm = { name: "", phone: "", email: "", message: "" };

const ContactForm = () => {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [inquiryType, setInquiryType] = useState("general");

  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (type) => {
    const t = type || inquiryType;
    if (!form.name.trim() || !form.email.trim() || !form.phone.trim() || !form.message.trim()) {
      toast.error("Please fill all fields before submitting.");
      return;
    }
    setLoading(true);
    setInquiryType(t);
    try {
      const res = await axios.post(`${API}/contact`, { ...form, inquiry_type: t });
      if (res.data?.id) {
        const label =
          t === "visit" ? "Farm visit request" :
          t === "produce" ? "Produce request" : "Inquiry";
        if (res.data.email_sent) {
          toast.success(`${label} sent! We'll get back to you shortly.`);
        } else {
          toast.success(`${label} received. We'll reach out shortly.`);
        }
        setForm(initialForm);
      }
    } catch (e) {
      toast.error("Something went wrong. Please try again or WhatsApp us.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="contact"
      data-testid={FARM.contactSection}
      className="relative py-24 md:py-32 bg-[#F4F1EA] overflow-hidden"
    >
      <div className="absolute inset-0 grain-overlay" />
      <div className="max-w-7xl mx-auto px-6 md:px-10 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left copy */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-5"
          >
            <div className="text-sm uppercase tracking-[0.28em] text-[#2E7D32]">
              Contact Us
            </div>
            <h2 className="mt-4 font-serif-display text-4xl sm:text-5xl md:text-6xl leading-[1.02] tracking-tight text-[#1A2E1A]">
              Say hello — we usually reply within a day.
            </h2>
            <p className="mt-6 text-[#6D4C41] font-light leading-relaxed max-w-md">
              Whether you would like a personal farm tour, wholesale pricing,
              or just a crate of this week&apos;s harvest — drop us a note. We
              read every message.
            </p>

            <div className="mt-10 rounded-2xl bg-white border border-[#E5E0D8] p-6">
              <div className="flex items-start gap-3">
                <Sparkles className="h-5 w-5 text-[#FBC02D] mt-0.5" />
                <div>
                  <div className="text-sm font-medium text-[#1A2E1A]">
                    Prefer instant chat?
                  </div>
                  <p className="text-sm text-[#6D4C41] mt-1">
                    Tap the WhatsApp button in the bottom-right to reach the
                    farm directly on your phone.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Form */}
          <motion.form
            data-testid={FARM.contactForm}
            onSubmit={(e) => {
              e.preventDefault();
              submit(inquiryType);
            }}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="lg:col-span-7 rounded-3xl bg-white border border-[#E5E0D8] p-6 md:p-10 shadow-2xl"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <label className="block">
                <span className="text-xs uppercase tracking-[0.28em] text-[#6D4C41]">
                  Name
                </span>
                <input
                  data-testid={FARM.contactName}
                  type="text"
                  value={form.name}
                  onChange={update("name")}
                  placeholder="Your full name"
                  className="mt-2 w-full bg-[#FDFBF7] border border-[#E5E0D8] focus:border-[#2E7D32] rounded-xl px-4 py-3 outline-none transition-colors text-[#1A2E1A] placeholder:text-[#6D4C41]/50"
                  required
                />
              </label>
              <label className="block">
                <span className="text-xs uppercase tracking-[0.28em] text-[#6D4C41]">
                  Phone
                </span>
                <input
                  data-testid={FARM.contactPhone}
                  type="tel"
                  value={form.phone}
                  onChange={update("phone")}
                  placeholder="+91 98•• •• ••••"
                  className="mt-2 w-full bg-[#FDFBF7] border border-[#E5E0D8] focus:border-[#2E7D32] rounded-xl px-4 py-3 outline-none transition-colors text-[#1A2E1A] placeholder:text-[#6D4C41]/50"
                  required
                />
              </label>
            </div>

            <label className="block mt-5">
              <span className="text-xs uppercase tracking-[0.28em] text-[#6D4C41]">
                Email
              </span>
              <input
                data-testid={FARM.contactEmail}
                type="email"
                value={form.email}
                onChange={update("email")}
                placeholder="you@example.com"
                className="mt-2 w-full bg-[#FDFBF7] border border-[#E5E0D8] focus:border-[#2E7D32] rounded-xl px-4 py-3 outline-none transition-colors text-[#1A2E1A] placeholder:text-[#6D4C41]/50"
                required
              />
            </label>

            <label className="block mt-5">
              <span className="text-xs uppercase tracking-[0.28em] text-[#6D4C41]">
                Message
              </span>
              <textarea
                data-testid={FARM.contactMessage}
                value={form.message}
                onChange={update("message")}
                placeholder="Tell us what you're looking for — a farm visit, wholesale rates, produce for this week, or a special request."
                rows={5}
                className="mt-2 w-full bg-[#FDFBF7] border border-[#E5E0D8] focus:border-[#2E7D32] rounded-xl px-4 py-3 outline-none transition-colors text-[#1A2E1A] placeholder:text-[#6D4C41]/50 resize-none"
                required
              />
            </label>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <button
                type="submit"
                data-testid={FARM.contactSubmit}
                disabled={loading}
                onClick={() => setInquiryType("general")}
                className="group flex-1 inline-flex items-center justify-center gap-2 bg-[#2E7D32] hover:bg-[#1A2E1A] disabled:opacity-60 disabled:cursor-not-allowed text-white px-6 py-4 rounded-full font-medium tracking-wide transition-colors shadow-lg"
              >
                <Send className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                {loading ? "Sending…" : "Send Message"}
              </button>
              <button
                type="button"
                data-testid={FARM.contactSubmitVisit}
                disabled={loading}
                onClick={() => submit("visit")}
                className="flex-1 inline-flex items-center justify-center gap-2 border border-[#2E7D32] text-[#2E7D32] hover:bg-[#2E7D32] hover:text-white px-6 py-4 rounded-full font-medium tracking-wide transition-colors"
              >
                Book a Farm Visit <ArrowRight className="h-4 w-4" />
              </button>
              <button
                type="button"
                data-testid={FARM.contactSubmitProduce}
                disabled={loading}
                onClick={() => submit("produce")}
                className="flex-1 inline-flex items-center justify-center gap-2 bg-[#FBC02D] text-[#1A2E1A] hover:bg-[#1A2E1A] hover:text-[#FBC02D] px-6 py-4 rounded-full font-medium tracking-wide transition-colors"
              >
                Request Fresh Produce
              </button>
            </div>
            <p className="mt-4 text-xs text-[#6D4C41]/80">
              By submitting, you agree to be contacted by Panda Farm House
              regarding your request. We will never share your details.
            </p>
          </motion.form>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;

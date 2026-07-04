import React, { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import {
  CalendarDays,
  Clock,
  Users,
  Sparkles,
  Send,
  ArrowRight,
  MessageCircle,
  X,
  ShieldCheck,
  Phone,
  Mail,
  Utensils,
  Flame,
  Music4,
  Cake,
  Camera,
  Trees,
  Sparkle,
  Check,
} from "lucide-react";

const API = (process.env.REACT_APP_BACKEND_URL || "").replace(/\/$/, "") + "/api";
const WHATSAPP_NUMBER = "918328830796";

const OCCASIONS = [
  "Year-End Feast",
  "Family Get-Together",
  "Birthday Celebration",
  "Anniversary",
  "Corporate Off-site",
  "Baby Shower",
  "Other Small Event",
];

const ADD_ONS = [
  { id: "meals",       label: "Farm-fresh Meals",        icon: Utensils },
  { id: "bonfire",     label: "Bonfire Setup",           icon: Flame },
  { id: "dj",          label: "DJ / Sound System",       icon: Music4 },
  { id: "cake",        label: "Cake Arrangement",        icon: Cake },
  { id: "photography", label: "Photography",             icon: Camera },
  { id: "decor",       label: "Traditional Decor",       icon: Sparkles },
  { id: "sparklers",   label: "Sparklers / Fireworks",   icon: Sparkle },
  { id: "farmtour",    label: "Guided Farm Tour",        icon: Trees },
];

const emptyForm = {
  name: "",
  email: "",
  phone: "",
  event_date: "",
  start_time: "",
  duration_hours: "",
  members: "",
  occasion: "",
  decoration_note: "",
  add_ons: [],
  notes: "",
};

// Simple client-side email format check to catch typos before hitting server.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const buildWhatsAppText = (f) => {
  const lines = [
    "*Panda Farm House — Booking Request*",
    "",
    `*Name:* ${f.name}`,
    `*Phone:* ${f.phone}`,
    `*Email:* ${f.email}`,
    "",
    `*Occasion:* ${f.occasion || "Not specified"}`,
    `*Date:* ${f.event_date}`,
    `*Start Time:* ${f.start_time}`,
    `*Duration:* ${f.duration_hours ? `${f.duration_hours} hrs` : "TBD"}`,
    `*Total Members:* ${f.members}`,
    "",
    `*Add-ons:* ${f.add_ons.length ? f.add_ons.join(", ") : "None"}`,
    "",
    `*Decoration:* ${f.decoration_note || "—"}`,
    `*Notes:* ${f.notes || "—"}`,
    "",
    "Please call me back to discuss pricing & confirm.",
  ];
  return encodeURIComponent(lines.join("\n"));
};

const BookingDialog = ({ open, onClose }) => {
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null); // holds submitted booking on success
  const scrollRef = useRef(null);
  const refs = {
    name: useRef(null),
    email: useRef(null),
    phone: useRef(null),
    event_date: useRef(null),
    start_time: useRef(null),
    members: useRef(null),
  };

  // When dialog opens, scroll to top so the first fields (name/email/phone) are visible.
  useEffect(() => {
    if (open && scrollRef.current) {
      scrollRef.current.scrollTop = 0;
      if (!success) setTimeout(() => refs.name.current?.focus(), 60);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, success]); // deps intentional

  const handleClose = () => {
    onClose();
    // Reset success state a little after close so the animation stays clean.
    setTimeout(() => setSuccess(null), 300);
  };

  const update = (k) => (e) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const toggleAddon = (label) =>
    setForm((f) => ({
      ...f,
      add_ons: f.add_ons.includes(label)
        ? f.add_ons.filter((x) => x !== label)
        : [...f.add_ons, label],
    }));

  const today = useMemo(() => new Date().toISOString().split("T")[0], []);

  const validate = () => {
    if (!form.name.trim())   return { msg: "Please enter your name.",   field: "name" };
    if (!form.email.trim())  return { msg: "Please enter your email.",  field: "email" };
    if (!EMAIL_RE.test(form.email.trim()))
      return { msg: "Please enter a valid email (e.g. name@example.com).", field: "email" };
    if (!form.phone.trim())  return { msg: "Please enter your phone number.", field: "phone" };
    if (form.phone.replace(/\D/g, "").length < 7)
      return { msg: "Please enter a valid phone number.", field: "phone" };
    if (!form.event_date)    return { msg: "Please pick an event date.", field: "event_date" };
    if (!form.start_time)    return { msg: "Please pick a start time.",  field: "start_time" };
    if (!form.members || Number(form.members) < 1)
      return { msg: "Please enter total members.", field: "members" };
    return null;
  };

  const focusField = (field) => {
    const el = refs[field]?.current;
    if (!el) return;
    // Scroll the dialog container so the field is comfortably visible near the top.
    const container = scrollRef.current;
    if (container) {
      const elTop = el.getBoundingClientRect().top;
      const cTop = container.getBoundingClientRect().top;
      container.scrollTop += (elTop - cTop) - 120;
    }
    setTimeout(() => el.focus({ preventScroll: true }), 80);
  };

  const submit = async () => {
    const err = validate();
    if (err) {
      toast.error(err.msg);
      focusField(err.field);
      return;
    }
    setLoading(true);
    try {
      const payload = {
        ...form,
        members: Number(form.members),
        occasion: form.occasion || "Not specified",
      };
      const res = await axios.post(`${API}/booking`, payload);
      if (res.data?.id) {
        setSuccess({ ...payload, id: res.data.id });
        setForm(emptyForm);
        if (scrollRef.current) scrollRef.current.scrollTop = 0;
      }
    } catch (e) {
      const detail = e?.response?.data?.detail;
      let msg = "Something went wrong. Please try again or WhatsApp us.";
      if (Array.isArray(detail) && detail.length) {
        const first = detail[0];
        const field = (first.loc || []).slice(-1)[0];
        msg = field
          ? `Please check the "${field}" field: ${first.msg || "invalid value"}.`
          : first.msg || msg;
      } else if (typeof detail === "string") {
        msg = detail;
      }
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      data-testid="booking-dialog"
      ref={scrollRef}
      className="fixed inset-0 z-[80] flex items-start justify-center p-3 md:p-6 md:pt-10 bg-[#1A2E1A]/85 backdrop-blur-md overflow-y-auto"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div className="w-full max-w-3xl bg-[#FDFBF7] rounded-3xl shadow-2xl border border-[#E5E0D8] overflow-hidden my-8">
        {success ? (
          <SuccessScreen data={success} onClose={handleClose} />
        ) : (
        <>
        {/* Header */}
        <div className="relative bg-[#1A2E1A] text-white px-6 md:px-10 py-8">
          <div className="absolute inset-0 grain-overlay opacity-40" />
          <div className="absolute -top-12 -right-12 h-40 w-40 rounded-full bg-[#FBC02D]/20 blur-3xl" />
          <button
            data-testid="booking-dialog-close"
            aria-label="Close"
            onClick={handleClose}
            className="absolute top-4 right-4 h-10 w-10 grid place-items-center rounded-full bg-white/10 hover:bg-white/20 transition-colors z-10"
          >
            <X className="h-4 w-4" />
          </button>
          <div className="relative">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#FBC02D]/40 bg-[#FBC02D]/10 px-3 py-1 text-[10px] uppercase tracking-[0.28em] text-[#FBC02D]">
              <Sparkles className="h-3 w-3" /> Book the Farmhouse
            </div>
            <h3 className="mt-4 font-serif-display text-3xl md:text-4xl leading-tight tracking-tight">
              Book an Appointment
            </h3>
            <p className="mt-2 text-sm text-white/70 max-w-xl">
              Tell us about your day — our team will call you back within 24
              hours to confirm availability and finalise pricing.
            </p>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 md:px-10 py-8 space-y-8">
          {/* Personal */}
          <section>
            <div className="text-[10px] uppercase tracking-[0.28em] text-[#2E7D32] mb-4">
              Your Details
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Full Name">
                <input
                  data-testid="booking-input-name"
                  ref={refs.name}
                  type="text"
                  value={form.name}
                  onChange={update("name")}
                  placeholder="Your full name"
                  className={inputCls}
                />
              </Field>
              <Field label="Phone">
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6D4C41]/60" />
                  <input
                    data-testid="booking-input-phone"
                    ref={refs.phone}
                    type="tel"
                    value={form.phone}
                    onChange={update("phone")}
                    placeholder="+91 98•• •• ••••"
                    className={`${inputCls} pl-10`}
                  />
                </div>
              </Field>
              <Field label="Email" className="md:col-span-2">
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6D4C41]/60" />
                  <input
                    data-testid="booking-input-email"
                    ref={refs.email}
                    type="email"
                    value={form.email}
                    onChange={update("email")}
                    placeholder="you@example.com"
                    className={`${inputCls} pl-10`}
                  />
                </div>
              </Field>
            </div>
          </section>

          {/* Event details */}
          <section>
            <div className="text-[10px] uppercase tracking-[0.28em] text-[#2E7D32] mb-4">
              Event Details
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Occasion">
                <select
                  data-testid="booking-input-occasion"
                  value={form.occasion}
                  onChange={update("occasion")}
                  className={inputCls}
                >
                  <option value="">Select an occasion</option>
                  {OCCASIONS.map((o) => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </select>
              </Field>
              <Field label="Total Members">
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6D4C41]/60" />
                  <input
                    data-testid="booking-input-members"
                    ref={refs.members}
                    type="number"
                    min={1}
                    value={form.members}
                    onChange={update("members")}
                    placeholder="e.g. 20"
                    className={`${inputCls} pl-10`}
                  />
                </div>
              </Field>
              <Field label="Event Date">
                <div className="relative">
                  <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6D4C41]/60 pointer-events-none" />
                  <input
                    data-testid="booking-input-date"
                    ref={refs.event_date}
                    type="date"
                    min={today}
                    value={form.event_date}
                    onChange={update("event_date")}
                    className={`${inputCls} pl-10`}
                  />
                </div>
              </Field>
              <Field label="Start Time">
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6D4C41]/60 pointer-events-none" />
                  <input
                    data-testid="booking-input-time"
                    ref={refs.start_time}
                    type="time"
                    value={form.start_time}
                    onChange={update("start_time")}
                    className={`${inputCls} pl-10`}
                  />
                </div>
              </Field>
              <Field label="Estimated Duration (hours)" className="md:col-span-2">
                <input
                  data-testid="booking-input-duration"
                  type="number"
                  min={1}
                  max={24}
                  value={form.duration_hours}
                  onChange={update("duration_hours")}
                  placeholder="e.g. 4"
                  className={inputCls}
                />
              </Field>
            </div>
          </section>

          {/* Add-ons */}
          <section>
            <div className="text-[10px] uppercase tracking-[0.28em] text-[#2E7D32] mb-4">
              Add-ons (arranged on the day of your event)
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {ADD_ONS.map(({ id, label, icon: Icon }) => {
                const active = form.add_ons.includes(label);
                return (
                  <button
                    key={id}
                    type="button"
                    data-testid={`booking-addon-${id}`}
                    onClick={() => toggleAddon(label)}
                    className={`flex items-center gap-3 text-left rounded-xl border px-4 py-3 transition-all ${
                      active
                        ? "border-[#2E7D32] bg-[#2E7D32]/5 text-[#1A2E1A] shadow-sm"
                        : "border-[#E5E0D8] bg-white text-[#1A2E1A] hover:border-[#2E7D32]/40"
                    }`}
                  >
                    <span
                      className={`h-9 w-9 grid place-items-center rounded-lg transition-colors ${
                        active ? "bg-[#2E7D32] text-white" : "bg-[#F4F1EA] text-[#2E7D32]"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="text-sm flex-1">{label}</span>
                    <span
                      className={`h-5 w-5 grid place-items-center rounded border ${
                        active
                          ? "bg-[#2E7D32] border-[#2E7D32] text-white"
                          : "border-[#E5E0D8] bg-white"
                      }`}
                    >
                      {active && <Check className="h-3 w-3" />}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Notes */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Decoration you'd like us to arrange">
              <textarea
                data-testid="booking-input-decoration"
                value={form.decoration_note}
                onChange={update("decoration_note")}
                rows={4}
                placeholder="Colour theme, flower arrangements, seating style, banners…"
                className={`${inputCls} resize-none`}
              />
            </Field>
            <Field label="Anything else we should know?">
              <textarea
                data-testid="booking-input-notes"
                value={form.notes}
                onChange={update("notes")}
                rows={4}
                placeholder="Dietary preferences, elderly guests, special songs, arrival plan…"
                className={`${inputCls} resize-none`}
              />
            </Field>
          </section>

          {/* Trust strip */}
          <div className="rounded-2xl bg-[#F4F1EA] border border-[#E5E0D8] p-5 flex items-start gap-3">
            <ShieldCheck className="h-5 w-5 text-[#2E7D32] mt-0.5 shrink-0" />
            <p className="text-sm text-[#6D4C41] leading-relaxed">
              Submitting this form does <strong className="text-[#1A2E1A]">not</strong> confirm your booking. Our team will
              call you within 24 hours to check availability, walk through your
              add-ons, and finalise a price. Booking starts from
              <strong className="text-[#1A2E1A]"> ₹1,499/hr</strong> — terms &amp; conditions apply.
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              type="button"
              data-testid="booking-submit"
              disabled={loading}
              onClick={submit}
              className="group flex-1 inline-flex items-center justify-center gap-2 bg-[#2E7D32] hover:bg-[#1A2E1A] disabled:opacity-60 disabled:cursor-not-allowed text-white px-6 py-4 rounded-full font-medium tracking-wide transition-colors shadow-lg"
            >
              <Send className="h-4 w-4" />
              {loading ? "Sending…" : "Submit Booking Enquiry"}
              <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
            <a
              data-testid="booking-whatsapp-direct"
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                "Hi Panda Farm House, I'd like to book the farm for an event."
              )}`}
              target="_blank"
              rel="noreferrer"
              className="sm:w-56 inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#128C7E] text-white px-6 py-4 rounded-full font-medium tracking-wide transition-colors"
            >
              <MessageCircle className="h-4 w-4" /> Chat First
            </a>
          </div>
        </div>
        </>
        )}
      </div>
    </div>
  );
};

const SuccessScreen = ({ data, onClose }) => {
  const waHref =
    `https://wa.me/${WHATSAPP_NUMBER}?text=${buildWhatsAppText(data)}`;
  const first = (data.name || "there").split(" ")[0];
  return (
    <div data-testid="booking-success" className="relative">
      <div className="relative bg-[#1A2E1A] text-white px-6 md:px-10 py-10 overflow-hidden">
        <div className="absolute inset-0 grain-overlay opacity-40" />
        <div className="absolute -top-16 -right-16 h-56 w-56 rounded-full bg-[#FBC02D]/20 blur-3xl" />
        <div className="relative flex items-start gap-4">
          <div className="h-14 w-14 md:h-16 md:w-16 grid place-items-center rounded-2xl bg-[#FBC02D] text-[#1A2E1A] shrink-0">
            <Check className="h-7 w-7" strokeWidth={3} />
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-[0.28em] text-[#FBC02D]">
              Booking Enquiry Received
            </div>
            <h3 className="mt-2 font-serif-display text-3xl md:text-4xl leading-tight">
              Thanks, {first}! 🌿
            </h3>
            <p className="mt-3 text-sm md:text-base text-white/80 max-w-xl leading-relaxed">
              We&rsquo;ve received your enquiry and sent a confirmation to{" "}
              <strong className="text-white">{data.email}</strong>. Our team
              will call you on <strong className="text-white">{data.phone}</strong>{" "}
              within 24 hours to confirm your date and finalise the pricing.
            </p>
          </div>
          <button
            data-testid="booking-success-close"
            aria-label="Close"
            onClick={onClose}
            className="ml-auto h-10 w-10 grid place-items-center rounded-full bg-white/10 hover:bg-white/20 transition-colors shrink-0"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="px-6 md:px-10 py-8 space-y-6">
        {/* Summary */}
        <div className="rounded-2xl border border-[#E5E0D8] bg-white overflow-hidden">
          <div className="px-5 py-3 bg-[#F4F1EA] text-[10px] uppercase tracking-[0.28em] text-[#2E7D32]">
            Your Enquiry
          </div>
          <dl className="divide-y divide-[#E5E0D8] text-sm">
            <SummaryRow k="Occasion" v={data.occasion || "Not specified"} />
            <SummaryRow k="Date" v={data.event_date} />
            <SummaryRow k="Start Time" v={data.start_time} />
            <SummaryRow k="Duration" v={data.duration_hours ? `${data.duration_hours} hrs` : "To be confirmed"} />
            <SummaryRow k="Members" v={data.members} />
            <SummaryRow
              k="Add-ons"
              v={data.add_ons?.length ? data.add_ons.join(", ") : "None"}
            />
          </dl>
        </div>

        {/* Next steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <a
            href={waHref}
            target="_blank"
            rel="noreferrer"
            data-testid="booking-success-whatsapp"
            className="group inline-flex items-center justify-center gap-3 bg-[#25D366] hover:bg-[#128C7E] text-white px-6 py-4 rounded-full font-medium tracking-wide transition-colors shadow-lg"
          >
            <MessageCircle className="h-5 w-5" />
            Continue on WhatsApp
            <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
          </a>
          <a
            href="tel:+919861448443"
            data-testid="booking-success-call"
            className="inline-flex items-center justify-center gap-3 border border-[#2E7D32] text-[#2E7D32] hover:bg-[#2E7D32] hover:text-white px-6 py-4 rounded-full font-medium tracking-wide transition-colors"
          >
            <Phone className="h-5 w-5" />
            Call +91 98614 48443
          </a>
        </div>

        {/* Reference */}
        <div className="flex items-center justify-between rounded-xl bg-[#F4F1EA] border border-[#E5E0D8] px-4 py-3">
          <div className="text-xs text-[#6D4C41]">
            Reference&nbsp;ID
          </div>
          <div className="text-xs font-mono text-[#1A2E1A]">{data.id}</div>
        </div>

        <p className="text-xs text-[#6D4C41] leading-relaxed">
          Didn&rsquo;t see the email? Check your spam/promotions folder or drop
          us a WhatsApp — we&rsquo;ll resend it.
        </p>
      </div>
    </div>
  );
};

const SummaryRow = ({ k, v }) => (
  <div className="flex items-start justify-between gap-4 px-5 py-3">
    <dt className="text-[#6D4C41] uppercase tracking-[0.22em] text-[10px] pt-0.5">{k}</dt>
    <dd className="text-[#1A2E1A] text-right max-w-[65%]">{v}</dd>
  </div>
);

const inputCls =
  "w-full bg-white border border-[#E5E0D8] focus:border-[#2E7D32] focus:ring-2 focus:ring-[#2E7D32]/15 rounded-xl px-4 py-3 outline-none transition-all text-[#1A2E1A] placeholder:text-[#6D4C41]/50";

const Field = ({ label, className = "", children }) => (
  <label className={`block ${className}`}>
    <span className="text-xs uppercase tracking-[0.24em] text-[#6D4C41]">{label}</span>
    <div className="mt-2">{children}</div>
  </label>
);

export default BookingDialog;

import React from "react";

// Custom emblem logo for Panda Farm House — pairs a leaf silhouette
// with a subtle panda-eye mark. Uses currentColor so it inherits
// text color where used.
const PandaLeafMark = ({ className = "h-9 w-9 text-[#2E7D32]" }) => (
  <svg
    viewBox="0 0 64 64"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    {/* Leaf */}
    <path
      d="M52 8C34 8 14 20 12 42c-1 11 5 15 12 15 20 0 34-19 32-43 0-3-1-6-4-6z"
      fill="currentColor"
      opacity="0.15"
    />
    <path
      d="M52 8C34 8 14 20 12 42c-1 11 5 15 12 15 20 0 34-19 32-43 0-3-1-6-4-6z"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinejoin="round"
    />
    {/* Central vein */}
    <path
      d="M18 54C28 44 42 28 52 10"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      fill="none"
    />
    {/* Panda eyes */}
    <ellipse cx="26" cy="34" rx="3" ry="4" fill="currentColor" />
    <ellipse cx="38" cy="30" rx="3" ry="4" fill="currentColor" />
    <circle cx="26" cy="34" r="1" fill="#FDFBF7" />
    <circle cx="38" cy="30" r="1" fill="#FDFBF7" />
  </svg>
);

export const Logo = ({ compact = false, className = "" }) => (
  <div className={`flex items-center gap-3 ${className}`}>
    <PandaLeafMark />
    <div className="flex flex-col leading-none">
      <span className="font-serif-display text-xl sm:text-2xl tracking-tight text-[#1A2E1A]">
        Panda Farm House
      </span>
      {!compact && (
        <span className="text-[10px] uppercase tracking-[0.28em] text-[#6D4C41] mt-1">
          Balasore · Odisha
        </span>
      )}
    </div>
  </div>
);

export default Logo;

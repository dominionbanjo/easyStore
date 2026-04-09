

import { ArrowRight, ShoppingBasket } from "lucide-react";

export function BuyNowButton({
  text = "Buy Now",
  onClick,
  disabled = false,
}: {
  text?: string;
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="
        relative flex items-center justify-between
        pl-6 pr-12 py-3 text-sm font-semibold text-white bg-neutral-900
        rounded-sm overflow-hidden
        transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)]
        hover: hover:scale-105
        disabled:opacity-50 disabled:cursor-not-allowed disabled:hover: disabled:hover:scale-100
        group
        min-w-[140px]
      "
    >
      {/* Expanding background circle on hover */}
      <span
        className="
          absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
          w-0 h-0 bg-neutral-800 rounded-sm 
          transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]
          group-hover:w-[300px] group-hover:h-[300px]
          group-disabled:w-0 group-disabled:h-0
        "
      />

      {/* Basket Icon (slides in from left) */}
      <ShoppingBasket
        className="
          absolute -left-8 w-4 h-4
          z-10
          transition-all duration-400 ease-[cubic-bezier(0.23,1,0.32,1)]
          group-hover:left-3
          group-disabled:left-[-2rem]
          text-white
        "
      />

      {/* Text (shifts right on hover to make room for basket) */}
      <span
        className="
          relative z-10 
          transition-all duration-400 ease-[cubic-bezier(0.23,1,0.32,1)]
          group-hover:translate-x-6
          whitespace-nowrap
          flex-1 text-center
        "
      >
        {text}
      </span>

      {/* Arrow Icon (slides out to right with spacing) */}
      <ArrowRight
        className="
          absolute right-5 w-4 h-4
          z-10
          transition-all duration-400 ease-[cubic-bezier(0.23,1,0.32,1)]
          opacity-100
          group-hover:right-[-2rem] group-hover:opacity-0
          group-disabled:right-5 group-disabled:opacity-100
          text-white
        "
      />
    </button>
  );
}
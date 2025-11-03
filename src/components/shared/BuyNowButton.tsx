import { ArrowRight, ShoppingBasket } from "lucide-react";

export function BuyNowButton({
  text = "Buy Now",
  onClick,
  disabled,
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
        relative flex items-center  justify-center gap-2
        px-16 py-2 text-xs font-semibold text-white bg-neutral-900
        rounded-full overflow-hidden
        transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)]
        hover:text-white group
      "
    >
      {/* Basket Icon (slides out) */}
      <ShoppingBasket
        className="
           absolute left-[-26%] w-4
           z-10
           transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)]
           group-hover:left-9  
          text-white
        "
      />

      {/* Text */}
      <span
        className="
 relative z-10 
      transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)]
          translate-x-[-10px] group-hover:translate-x-[10px]
        "
      >
        {text}
      </span>

      <span
        className="
          absolute w-5 h-5 bg-black rounded-full opacity-0
          transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)]
          group-hover:w-[230px] group-hover:h-[230px] group-hover:opacity-100
        "
      />

      {/* Arrow Icon (slides in) */}
      <ArrowRight
        className="
        absolute right-4 w-4
         transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)]
          group-hover:right-[-26%] group-hover:fill-neutral-900 group-hover:text-neutral-900
          text-white
        "
      />
    </button>
  );
}

import { cva } from "class-variance-authority";

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-sm text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default:
          "bg-[#17c06e] text-white  hover:bg-[#17c06e]/90 -[#17c06e]/20",
        destructive: "bg-rose-500 text-white  hover:bg-rose-600",
        outline:
          "border border-zinc-200 bg-white text-zinc-900  hover:bg-zinc-50 dark:border-white/10 dark:bg-neutral-900/50 dark:text-white dark:hover:bg-white/5",
        secondary:
          "bg-zinc-100 text-zinc-900  hover:bg-zinc-200/80 dark:bg-white/5 dark:text-white dark:hover:bg-white/10",
        ghost:
          "hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-white/5 dark:hover:text-white dark:text-zinc-400 dark:hover:text-emerald-400",
        link: "text-[#17c06e] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 px-6 rounded-sm",
        sm: "h-9 rounded-sm px-3 text-xs",
        lg: "h-12 rounded-sm px-8 text-base",
        icon: "h-10 w-10 rounded-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

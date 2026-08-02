import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes } from "react";
import { useHaptics } from "@/lib/pawprint/haptics";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "press inline-flex w-full items-center justify-center gap-2 rounded-2xl text-[15px] font-semibold tracking-tight disabled:pointer-events-none disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-foreground shadow-[var(--shadow-glow)] hover:bg-primary/92",
        secondary: "bg-secondary text-secondary-foreground hover:bg-muted",
        outline: "border border-border bg-card text-foreground hover:bg-muted",
        ghost: "text-primary hover:bg-primary-soft",
        light: "bg-white/95 text-ink hover:bg-white",
        glass: "border border-white/25 bg-white/10 text-white backdrop-blur-md hover:bg-white/20",
      },
      size: {
        lg: "h-14 px-6",
        md: "h-12 px-5 text-sm",
        sm: "h-10 w-auto px-4 text-[13px]",
      },
    },
    defaultVariants: { variant: "primary", size: "lg" },
  },
);

interface Props
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export function Button({ className, variant, size, asChild, onClick, ...props }: Props) {
  const haptic = useHaptics();
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      className={cn(buttonVariants({ variant, size }), className)}
      onClick={(e) => {
        haptic(10);
        onClick?.(e);
      }}
      {...props}
    />
  );
}

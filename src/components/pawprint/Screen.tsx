import { Link } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import { useEffect, type ReactNode } from "react";
import { hydrateRegistry } from "@/lib/pawprint/store";
import { cn } from "@/lib/utils";

interface ScreenProps {
  children?: ReactNode;
  title?: string;
  back?: string;
  action?: ReactNode;
  className?: string;
  bare?: boolean;
}

export function Screen({ children, title, back, action, className, bare }: ScreenProps) {
  useEffect(() => {
    hydrateRegistry();
  }, []);

  return (
    <div className={cn("min-h-screen bg-background", bare && "bg-ink")}>
      {(title || back) && (
        <header
          className={cn(
            "sticky top-0 z-30 border-b border-border/70 bg-background/85 backdrop-blur-xl",
            bare && "border-white/10 bg-ink/80",
          )}
        >
          <div className="mx-auto flex h-14 max-w-lg items-center gap-1 px-2">
            {back ? (
              <Link
                to={back}
                aria-label="Go back"
                className={cn(
                  "press flex h-11 w-11 items-center justify-center rounded-full text-foreground/70 hover:bg-muted",
                  bare && "text-white/80 hover:bg-white/10",
                )}
              >
                <ChevronLeft className="h-5 w-5" />
              </Link>
            ) : (
              <span className="w-2" />
            )}
            <h1
              className={cn(
                "flex-1 truncate text-[15px] font-semibold tracking-tight",
                bare && "text-white",
              )}
            >
              {title}
            </h1>
            {action}
          </div>
        </header>
      )}
      <main className={cn("mx-auto w-full max-w-lg px-5 pb-16", className)}>{children}</main>
    </div>
  );
}

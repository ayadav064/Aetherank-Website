/**
 * FadeIn — pure CSS + IntersectionObserver, zero framer-motion dependency.
 * Eliminates framer-motion from the critical path entirely.
 */
import { useRef, useEffect, forwardRef, ReactNode } from "react";

interface FadeInProps {
  children: ReactNode;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  className?: string;
  fullWidth?: boolean;
}

const isServer = typeof window === "undefined";

const TRANSLATE: Record<NonNullable<FadeInProps["direction"]>, string> = {
  up:    "translateY(24px)",
  down:  "translateY(-24px)",
  left:  "translateX(24px)",
  right: "translateX(-24px)",
  none:  "none",
};

const FadeInClient = forwardRef<HTMLDivElement, FadeInProps>(
  function FadeInClient({ children, delay = 0, direction = "up", className = "", fullWidth = false }) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const el = ref.current;
      if (!el) return;
      // Reset to invisible on every mount (handles back-navigation remounts)
      el.style.opacity = "0";
      el.style.transform = TRANSLATE[direction];
      const io = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            el.style.opacity = "1";
            el.style.transform = "none";
            io.disconnect();
          }
        },
        { threshold: 0.1, rootMargin: "0px 0px -20px 0px" }
      );
      io.observe(el);
      return () => io.disconnect();
    }, [direction]);

    return (
      <div
        ref={ref}
        className={`${fullWidth ? "w-full" : ""} ${className}`}
        style={{
          opacity: 0,
          transform: TRANSLATE[direction],
          transition: `opacity 0.6s ease ${delay}s, transform 0.6s ease ${delay}s`,
          willChange: "opacity, transform",
        }}
      >
        {children}
      </div>
    );
  }
);

export function FadeIn({ children, delay = 0, direction = "up", className = "", fullWidth = false }: FadeInProps) {
  // SSR: render immediately visible so crawlers see full content
  if (isServer) {
    return <div className={`${fullWidth ? "w-full" : ""} ${className}`}>{children}</div>;
  }
  return <FadeInClient delay={delay} direction={direction} className={className} fullWidth={fullWidth}>{children}</FadeInClient>;
}

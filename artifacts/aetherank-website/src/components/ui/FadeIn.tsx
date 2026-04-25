import { motion, useReducedMotion } from "framer-motion";
import { ReactNode } from "react";

interface FadeInProps {
  children: ReactNode;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  className?: string;
  fullWidth?: boolean;
}

// Detect SSR: typeof window is undefined on the server.
const isServer = typeof window === "undefined";

export function FadeIn({ 
  children, 
  delay = 0, 
  direction = "up", 
  className = "",
  fullWidth = false
}: FadeInProps) {
  const prefersReducedMotion = useReducedMotion();

  const directions = {
    up: { y: 30, x: 0 },
    down: { y: -30, x: 0 },
    left: { x: 30, y: 0 },
    right: { x: -30, y: 0 },
    none: { x: 0, y: 0 }
  };

  // On the server (SSR) or when user prefers reduced motion:
  // render children immediately visible so crawlers see full content
  // and hydration matches the SSR output without a flash.
  if (isServer || prefersReducedMotion) {
    return (
      <div className={`${fullWidth ? "w-full" : ""} ${className}`}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ 
        opacity: 0, 
        ...directions[direction] 
      }}
      whileInView={{ 
        opacity: 1, 
        x: 0, 
        y: 0 
      }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{
        duration: 0.7,
        ease: [0.21, 0.47, 0.32, 0.98],
        delay: delay,
      }}
      className={`${fullWidth ? "w-full" : ""} ${className}`}
    >
      {children}
    </motion.div>
  );
}

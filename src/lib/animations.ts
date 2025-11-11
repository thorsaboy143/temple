import { Variants } from "framer-motion";

// iOS-inspired timing functions
export const timings = {
  short: 0.18, // 180ms - fast micro-interactions
  medium: 0.24, // 240ms - standard transitions
  long: 0.32, // 320ms - elaborate animations
};

// Clean, minimal easing curves (no bouncing)
export const easings = {
  // Standard iOS easing - gentle acceleration and deceleration
  ios: [0.2, 0.0, 0.0, 1.0] as const,
  // Slight emphasis on the exit for natural feeling
  emphasized: [0.2, 0.0, 0.0, 0.9] as const,
  // Extra gentle for micro-interactions
  soft: [0.1, 0.0, 0.0, 1.0] as const,
};

// Shared variants for consistent animations
export const fadeInOut: Variants = {
  initial: { 
    opacity: 0,
    scale: 0.98,
    y: 4
  },
  animate: { 
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: timings.medium,
      ease: easings.ios
    }
  },
  exit: { 
    opacity: 0,
    scale: 0.98,
    y: 2,
    transition: {
      duration: timings.short,
      ease: easings.emphasized
    }
  }
};

// Subtle page transitions
export const pageTransition: Variants = {
  initial: {
    opacity: 0,
    y: 8
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: timings.medium,
      ease: easings.ios,
      staggerChildren: 0.05
    }
  },
  exit: {
    opacity: 0,
    y: 4,
    transition: {
      duration: timings.short,
      ease: easings.emphasized
    }
  }
};

// Micro-interaction for buttons
export const buttonTap = {
  scale: 0.98,
  opacity: 0.8,
  transition: {
    duration: timings.short,
    ease: easings.soft
  }
};

// Subtle hover effect
export const buttonHover = {
  scale: 1.02,
  opacity: 0.95,
  transition: {
    duration: timings.short,
    ease: easings.soft
  }
};

// Loading state animation
export const loadingSpinner: Variants = {
  animate: {
    rotate: 360,
    transition: {
      duration: 1,
      ease: "linear",
      repeat: Infinity
    }
  }
};

// Form field focus animation
export const fieldFocus = {
  scale: 1.02,
  transition: {
    duration: timings.short,
    ease: easings.soft
  }
};

// Toast/notification slide
export const toastSlide: Variants = {
  initial: { opacity: 0, y: -20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: timings.medium,
      ease: easings.ios
    }
  },
  exit: { 
    opacity: 0, 
    y: -10,
    transition: {
      duration: timings.short,
      ease: easings.emphasized
    }
  }
};
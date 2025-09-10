// Container & Items
export const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.3,
      staggerChildren: 0.1,
    },
  },
};

export const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

// Buttons
export const buttonVariants = {
  rest: { scale: 1 },
  hover: { 
    scale: 1.05,
    transition: { type: "spring", stiffness: 300, damping: 20 },
  },
  tap: { 
    scale: 0.95,
    transition: { duration: 0.1 },
  },
};

// Tabs
export const tabVariants = {
  inactive: { 
    backgroundColor: "transparent",
    color: "var(--fallback-bc,oklch(var(--bc)/0.6))",
  },
  active: { 
    backgroundColor: "var(--fallback-p,oklch(var(--p)/1))",
    color: "var(--fallback-pc,oklch(var(--pc)/1))",
    transition: { duration: 0.2, ease: "easeInOut" },
  },
};

// Modal
export const modalVariants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
    transition: { duration: 0.2 },
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { 
      duration: 0.3,
      type: "spring",
      stiffness: 300,
      damping: 25,
    },
  },
};

// Overlay
export const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.2 },
  },
};

// Dropdown
export const dropdownVariants = {
  hidden: { 
    opacity: 0, 
    scale: 0.95, 
    y: -10,
    transition: { duration: 0.15 },
  },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: { 
      duration: 0.2,
      ease: "easeOut",
    },
  },
};

// Accordion
export const accordionVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: "easeOut" },
  },
};

// Project Card
export const projectCardVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { 
      duration: 0.4,
      type: "spring",
      stiffness: 300,
      damping: 25,
    },
  }
};

// Badge
export const badgeVariants = {
  hidden: { scale: 0, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 500,
      damping: 25,
      delay: 0.2,
    },
  },
};


export const loadingSpinnerVariants = {
  spin: {
    rotate: 360,
    transition: {
      repeat: Infinity,
      duration: 1,
      ease: "linear",
    },
  },
};

// ✨ Loading Text
export const loadingTextVariants = {
  pulse: {
    opacity: [0.6, 1, 0.6],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

export const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.4, ease: "easeOut" }
  })
};

export const fadeInLeft = {
  hidden: { opacity: 0, x: -60, position: "relative" },
  visible: { 
    opacity: 1, 
    x: 0, 
    transition: { duration: 0.6, ease: "easeOut" } 
  }
}
export const fadeInRight = {
  hidden: { opacity: 0, x: 30, position: "relative" },
  visible: { 
    opacity: 1, 
    x: 0, 
    transition: { duration: 0.6, ease: "easeOut" } 
  }
};
export const fadeInDown = {
  hidden: { opacity: 0, y: -40, position: "relative" },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.6, ease: "easeOut" } 
  }
}


export const modalVariant = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } }
};

export const fieldVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3 }
    }
};


export const formVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.5,
      staggerChildren: 0.1
    }
  }
};
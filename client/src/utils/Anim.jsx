export const containerVariants = {
    hidden: {
      transition: {
        staggerChildren: 0.05,
        staggerDirection: -1,
        delayChildren: 0.1,
        ease: "easeInOut",
        duration: 0.3,
      },
    },
    visible: {
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.05,
        ease: "easeInOut",
        duration: 0.3,
      },
    },
  };

export const rowVariants = {
  hidden: { opacity: 0, height:0 },
  visible: {
    opacity: 1,
    height:'auto',
    transition: {
      duration: 0.5,
      ease: 'easeOut',
      type: 'spring',
      stiffness: 100,
      damping: 10,
    },
  },
  exit: {
    opacity: 0,
    height: 0,
    transition: {
      duration: 0.2,
      ease: 'easeOut',
      type: 'spring',
      stiffness: 100,
      damping: 15,
    },
  },
};

export const transformContainerVariants = {
    hidden: {
      transition: {
        staggerChildren: 0.05,
        staggerDirection: -1,
      },
    },
    visible: {
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

export const transformRowVariants = {
  hidden: { opacity: 0, y:-20 },
  visible: {
    opacity: 1,
    y:0,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.3,
      ease: 'easeIn',
    },
  },
};

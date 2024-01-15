import { Variants } from "framer-motion";

export const ContainerVariants: Variants = {
  initial: {
    opacity: 0,
    transition: { duration: 0.3 },
  },
  animate: {
    opacity: 1,
    transition: { duration: 0.3 },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.3 },
  },
};

export const TextVariants: Variants = {
  initial: {
    opacity: 0,
    y: 5,
    transition: { duration: 0.5 },
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, staggerChildren: 0.2 },
  },
  exit: {
    opacity: 0,
    y: 5,
    transition: { duration: 0.5 },
  },
};

export const MemberCardVariants: Variants = {
  initial: {
    opacity: 0,
    transition: { duration: 0.1 },
  },
  animate: {
    opacity: 1,
    transition: { duration: 0.1 },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.1 },
  },
};

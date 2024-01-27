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

export const ContainerHeightVariants: Variants = {
  initial: {
    opacity: 0,
    height: 0,
    transition: { duration: 0.3 },
  },
  animate: {
    opacity: 1,
    height: "auto",
    transition: { duration: 0.3 },
  },
  exit: {
    opacity: 0,
    height: 0,
    transition: { duration: 0.3 },
  },
};

export const ContainerInputVariants: Variants = {
  initial: {
    opacity: 0,
    height: 100,
    transition: { duration: 0.3 },
  },
  animate: {
    opacity: 1,
    height: "auto",
    transition: { duration: 0.3 },
  },
  exit: {
    opacity: 0,
    height: 0,
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

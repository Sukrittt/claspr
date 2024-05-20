"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { ContainerVariants } from "@/lib/motion";
import { useMounted } from "@/hooks/use-mounted";
import { quotes, type Quote } from "@/config/quote";

export const RandomizedQuote = () => {
  const mounted = useMounted();
  const [randomQuote, setRandomQuote] = useState<Quote | null>(null);

  useEffect(() => {
    if (!mounted) return;

    const randomIndex = Math.floor(Math.random() * quotes.length);
    setRandomQuote(quotes[randomIndex]);
  }, [mounted]);

  return (
    <AnimatePresence mode="wait">
      {randomQuote && (
        <motion.div
          variants={ContainerVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="space-y-2 w-1/2"
        >
          <div className="h-10 w-10 absolute -ml-10">
            <Image src="/image.png" alt="quotes" fill priority />
          </div>
          <h1 className="text-7xl font-bold text-neutral-200 leading-tight">
            {randomQuote.quote}
          </h1>

          <p className="text-neutral-200 dark:text-foreground font-medium">
            ⁓ {randomQuote.person}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

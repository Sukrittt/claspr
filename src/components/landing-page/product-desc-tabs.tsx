"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import {
  CalendarDays,
  FileText,
  LayoutDashboard,
  MessagesSquare,
  Sparkles,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { ContainerVariants } from "@/lib/motion";
import { PinContainer } from "@/components/ui/3d-pin";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const ProductDescTabs = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  const tabLists = [
    {
      value: "dashboard",
      label: "Dashboard",
      description: "Slick, Agile, Organized. Stay Ahead.",
      icon: LayoutDashboard,
      activeIconClass: "text-sky-500",
      videoSrc: "/scribe-dashboard.mp4",
    },
    {
      value: "ai",
      label: "AI",
      icon: Sparkles,
      description: "Ask anything. Curious Companion, Fun Follow-ups.",
      activeIconClass: "text-purple-500",
      videoSrc: "/scribe-ai.mp4",
    },
    {
      value: "interaction",
      label: "Interaction",
      icon: MessagesSquare,
      description: "Engage, Discuss, Spark. Connect and Collaborate.",
      activeIconClass: "text-green-500",
      videoSrc: "/scribe-interact.mp4",
    },
    {
      value: "docs",
      label: "Docs",
      icon: FileText,
      description: "Sleek, potent, stunning. Next-level notes & docs.",
      activeIconClass: "text-yellow-500",
      videoSrc: "/scribe-notes.mp4",
    },
    {
      value: "calendar",
      label: "Calendar",
      icon: CalendarDays,
      description: "Plan, Organize, Manage. Stay Ahead.",
      activeIconClass: "text-orange-500",
      videoSrc: "/scribe-calendar.mp4",
    },
  ];

  return (
    <Tabs
      value={activeTab}
      onValueChange={(val) => setActiveTab(val)}
      className="w-full max-w-2xl"
    >
      {tabLists.map((tab) => (
        <TabsContent key={tab.value} value={tab.value}>
          <PinContainer title={tab.description}>
            <AnimatePresence mode="wait">
              <motion.div
                variants={ContainerVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="h-[20rem] w-[40rem]"
              >
                <video src={tab.videoSrc} muted autoPlay loop />
              </motion.div>
            </AnimatePresence>
          </PinContainer>
        </TabsContent>
      ))}
      <TabsList className="flex w-full items-center justify-around pt-28">
        {tabLists.map((tab, index) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className={cn({ "pr-0": tabLists.length - 1 === index })}
          >
            <div className="flex flex-col items-center gap-y-2">
              <tab.icon
                className={cn("h-5 w-5 transition-colors", {
                  [tab.activeIconClass]: activeTab === tab.value,
                })}
              />
              <span className="text-[15px]">{tab.label}</span>
            </div>
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
};

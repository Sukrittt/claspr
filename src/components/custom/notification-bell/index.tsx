"use client";
import {
  type IMessage,
  NovuProvider,
  PopoverNotificationCenter,
} from "@novu/notification-center";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { Bell, BellDot } from "lucide-react";

import "./styles.css";

export const NotificationBell = ({ userId }: { userId: string }) => {
  const router = useRouter();
  const { theme } = useTheme();

  const getNotificationColorScheme = () => {
    switch (theme) {
      case "dark":
      case "system":
        return "dark";
      default:
        return "light";
    }
  };

  const handleNotificationClick = (message: IMessage) => {
    router.push(message.payload.url as string);
  };

  return (
    <NovuProvider
      subscriberId={userId}
      applicationIdentifier={process.env.NEXT_PUBLIC_APPLICATION_IDENTIFIER!}
      styles={{
        loader: {
          root: {
            stroke: theme === "dark" ? "#d6d6d6" : "#262626",
          },
        },
      }}
    >
      <PopoverNotificationCenter
        onNotificationClick={handleNotificationClick}
        colorScheme={getNotificationColorScheme()}
      >
        {({ unseenCount }) => (
          <div className="relative cursor-pointer">
            {unseenCount && unseenCount > 0 ? (
              <BellDot className="h-4 w-4 text-red-500" />
            ) : (
              <Bell className="h-4 w-4" />
            )}
          </div>
        )}
      </PopoverNotificationCenter>
    </NovuProvider>
  );
};

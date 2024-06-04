"use client";
import {
  NovuProvider,
  PopoverNotificationCenter,
  NotificationBell as NotifIcon,
} from "@novu/notification-center";
import { useTheme } from "next-themes";

export const NotificationBell = ({ userId }: { userId: string }) => {
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

  const handleNotificationClick = () => {};

  return (
    <NovuProvider
      subscriberId={userId}
      applicationIdentifier={process.env.NEXT_PUBLIC_APPLICATION_IDENTIFIER!}
    >
      <PopoverNotificationCenter colorScheme={getNotificationColorScheme()}>
        {({ unseenCount }) => (
          <div className="relative cursor-pointer">
            <NotifIcon unseenCount={unseenCount} />

            {/* {unseenCount && unseenCount > 0 ? (
              <div className="absolute right-4 top-3 h-2 w-2 rounded-full bg-red-500" />
            ) : null} */}
          </div>
        )}
      </PopoverNotificationCenter>
    </NovuProvider>
  );
};

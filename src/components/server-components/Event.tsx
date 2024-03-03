import { redirect } from "next/navigation";

import { getAuthSession } from "@/lib/auth";
import { Calendar } from "@/components/event/calendar";

export const Event = async () => {
  const session = await getAuthSession();

  if (!session) redirect("/sign-in");

  return <Calendar sessionId={session.user.id} />;
};

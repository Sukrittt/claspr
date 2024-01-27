"use client";
import { useState } from "react";
import { ClassRoom } from "@prisma/client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AnnouncementFlow } from "./announcement-flow";

const TOTAL_STEPS = 2;

export const AnnouncementCard = ({ classroom }: { classroom: ClassRoom }) => {
  const [stepNumber, setStepNumber] = useState(1);

  return (
    <div className="grid place-items-center h-full">
      <Card className="w-[700px] overflow-hidden border border-neutral-300 bg-neutral-100">
        <CardHeader className="bg-neutral-200 py-3 space-y-1">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-gray-800 text-sm">
                Create a new assignment
              </CardTitle>
              <CardDescription>
                This will be displayed to all the members of this classroom
              </CardDescription>
            </div>
            <span className="text-xs text-muted-foreground">
              {stepNumber} of {TOTAL_STEPS}
            </span>
          </div>
        </CardHeader>
        <CardContent className="pt-3 pb-0">
          <AnnouncementFlow
            classroom={classroom}
            setStepNumber={setStepNumber}
          />
        </CardContent>
      </Card>
    </div>
  );
};

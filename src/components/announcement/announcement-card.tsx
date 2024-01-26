"use client";
import { useState } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AnnouncementFlow } from "./announcement-flow";

const TOTAL_STEPS = 3;

export const AnnouncementCard = ({ classroomId }: { classroomId: string }) => {
  const [stepNumber, setStepNumber] = useState(1);

  return (
    <div className="grid place-items-center h-full">
      <Card className="min-w-[600px] overflow-hidden border border-neutral-300 bg-neutral-100">
        <CardHeader className="bg-neutral-200 py-3 space-y-1">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-gray-800 text-sm">
                Create a new announcement
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
        <CardContent className="py-3">
          <AnnouncementFlow
            classroomId={classroomId}
            setStepNumber={setStepNumber}
          />
        </CardContent>
      </Card>
    </div>
  );
};

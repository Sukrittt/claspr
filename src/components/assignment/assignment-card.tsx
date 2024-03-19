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
import { AssignmentFlow } from "./assignment-flow";

const TOTAL_STEPS = 2;

export const AssignmentCard = ({ classroom }: { classroom: ClassRoom }) => {
  const [stepNumber, setStepNumber] = useState(1);

  return (
    <div className="grid place-items-center h-full">
      <Card className="w-[700px]">
        <CardHeader className="py-3 border-b">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-gray-800 dark:text-foreground text-sm">
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
          <AssignmentFlow classroom={classroom} setStepNumber={setStepNumber} />
        </CardContent>
      </Card>
    </div>
  );
};

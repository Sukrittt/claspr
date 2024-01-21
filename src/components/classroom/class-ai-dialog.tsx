import { Sparkles } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ExtendedClassroom } from "@/types";
import { Button } from "@/components/ui/button";
import { CustomTooltip } from "@/components/custom/custom-tooltip";

interface ClassAIDialogProps {
  classroom: ExtendedClassroom;
}

export const ClassAIDialog: React.FC<ClassAIDialogProps> = ({ classroom }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="absolute bottom-8 right-10 group">
          <CustomTooltip text="Ask AI">
            <div>
              <Button className="rounded-full p-2 h-12 w-12">
                <Sparkles className="w-5 h-5 group-hover:rotate-90 transition duration-300" />
              </Button>
            </div>
          </CustomTooltip>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ask AI Hub</DialogTitle>
          <DialogDescription>
            Unlock answers, explore possibilities, and interact with our AI
          </DialogDescription>
        </DialogHeader>
        <p>Coming Soon!</p>
      </DialogContent>
    </Dialog>
  );
};

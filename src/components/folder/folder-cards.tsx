"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const FolderCards = () => {
  return (
    <Card>
      <CardHeader className="border-b py-2.5 space-y-0.5">
        <CardTitle className="text-base pt-1">Your Folders</CardTitle>

        <CardDescription className="text-[13px] flex gap-x-1 items-center">
          You can create folders to organize your notes
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6 text-sm">Content</CardContent>
    </Card>
  );
};

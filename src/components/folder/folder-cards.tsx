"use client";
import { useAtom } from "jotai";
import { useEffect } from "react";

import { folderAtom } from "@/atoms";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { usePersonalFolders } from "@/hooks/folder";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CreateFolderDialog } from "./mutations/create-folder-dialog";
import { ExtendedFolder } from "@/types";

export const FolderCards = () => {
  const [folders, setFolders] = useAtom(folderAtom);

  const { data: serverFolders, isLoading } = usePersonalFolders();

  useEffect(() => {
    if (serverFolders) {
      setFolders(serverFolders);
    }
  }, [serverFolders]);

  return (
    <Card>
      <CardHeader className="border-b py-2.5 space-y-0.5">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base pt-1">Your Folders</CardTitle>

          <CreateFolderDialog />
        </div>

        <CardDescription className="text-[13px] flex gap-x-1 items-center">
          You can create folders to organize your notes
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6 text-sm">
        <ScrollArea className="h-[25vh]">
          {isLoading ? (
            <p>Loading...</p>
          ) : !folders || folders.length === 0 ? (
            <p>No folders</p>
          ) : (
            folders.map((folder) => (
              <FolderCard key={folder.id} folder={folder} />
            ))
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

interface FolderCardProps {
  folder: ExtendedFolder;
}

const FolderCard: React.FC<FolderCardProps> = ({ folder }) => {
  return <div></div>;
};

import { useAtom } from "jotai";
import { useEffect } from "react";

import {
  CreatedClassGridView,
  CreatedClassListView,
} from "./created-class-card";
import { trpc } from "@/trpc/client";
import { ViewSelector } from "./view-selector";
import { ScrollArea } from "@/components/ui/scroll-area";
import { classesCreatedAtom, classesJoinedAtom } from "@/atoms";
import { useCreatedView, useJoinedView } from "@/hooks/use-view";
import { Loader } from "lucide-react";

export const TeacherClasses = () => {
  const [createdView, setCreatedView] = useCreatedView();
  const [joinedView, setJoinedView] = useJoinedView();

  const [, setClassesJoined] = useAtom(classesJoinedAtom);
  const [, setClassesCreated] = useAtom(classesCreatedAtom);

  const { data: classesCreated, isLoading: isFetchingClassesCreated } =
    trpc.class.getClassesCreated.useQuery();

  const { data: classesJoined, isLoading: isFetchingClassesJoined } =
    trpc.class.getClassesJoined.useQuery({
      isTeacher: true,
    });

  useEffect(() => {
    if (classesCreated) {
      setClassesCreated(classesCreated);
    }
  }, [classesCreated]);

  useEffect(() => {
    if (classesJoined) {
      setClassesJoined(classesJoined);
    }
  }, [classesJoined]);

  return (
    <div className="flex flex-col gap-y-8">
      <div className="">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-gray-800">
            Classes Created by You
          </h3>
          <ViewSelector layoutView={createdView} setView={setCreatedView} />
        </div>
        {isFetchingClassesCreated ? (
          <div className="flex h-[200px] gap-2 items-center justify-center">
            <Loader className="w-4 h-4 animate-spin" />
            <p>Just a moment</p>
          </div>
        ) : !classesCreated || classesCreated?.length === 0 ? (
          <div className="h-[200px] grid place-items-center">
            <p className="text-center text-muted-foreground text-sm">
              No classes created
            </p>
          </div>
        ) : createdView.view === "grid" ? (
          <ScrollArea className="h-[200px]">
            <div className="grid grid-cols-3 gap-4 pt-2">
              {classesCreated.map((classRoom) => (
                <CreatedClassGridView
                  key={classRoom.id}
                  classRoom={classRoom}
                />
              ))}
            </div>
          </ScrollArea>
        ) : (
          <div className="space-y-1 pt-2">
            <div className="px-3 py-1 text-xs font-semibold text-muted-foreground grid grid-cols-5 gap-x-2 items-center">
              <p className="col-span-3">Name</p>
              <p>Created By</p>
              <p>Updated At</p>
            </div>
            <div className="flex flex-col gap-y-2">
              {classesCreated.map((classRoom) => (
                <CreatedClassListView
                  key={classRoom.id}
                  classRoom={classRoom}
                />
              ))}
            </div>
          </div>
        )}
      </div>
      <div>
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-gray-800">Classes Joined by You</h3>
          <ViewSelector layoutView={joinedView} setView={setJoinedView} />
        </div>
        {isFetchingClassesJoined ? (
          <div className="flex h-[200px] gap-2 items-center justify-center">
            <Loader className="w-4 h-4 animate-spin" />
            <p>Just a moment</p>
          </div>
        ) : classesJoined?.length === 0 ? (
          <div className="h-[200px] grid place-items-center">
            <p className="text-center text-muted-foreground text-sm">
              No classes joined
            </p>
          </div>
        ) : (
          <p>Classes joined</p>
        )}
        {/* Display classes joined */}
      </div>
    </div>
  );
};

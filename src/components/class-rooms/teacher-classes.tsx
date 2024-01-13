import { useAtom } from "jotai";
import { useEffect } from "react";
import { Loader } from "lucide-react";

import { trpc } from "@/trpc/client";
import { ViewSelector } from "./view-selector";
import { classesCreatedAtom, classesJoinedAtom } from "@/atoms";
import { useCreatedView, useJoinedView } from "@/hooks/use-view";

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
        {/* Display classes created */}
        {isFetchingClassesCreated ? (
          <p>Loading...</p>
        ) : classesCreated?.length === 0 ? (
          <p>No classes created</p>
        ) : (
          <p>Classes created</p>
        )}
      </div>
      <div className="">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-gray-800">Classes Joined by You</h3>
          <ViewSelector layoutView={joinedView} setView={setJoinedView} />
        </div>
        {/* Display classes created */}

        {isFetchingClassesJoined ? (
          <p>Loading...</p>
        ) : classesJoined?.length === 0 ? (
          <p>No classes joined</p>
        ) : (
          <p>Classes joined</p>
        )}
      </div>
    </div>
  );
};

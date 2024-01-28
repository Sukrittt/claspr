"use client";
import { useAtom } from "jotai";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { documentAtom, linkAtom } from "@/atoms";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const SubmissionCard = () => {
  const [links, setLinks] = useAtom(linkAtom);
  const [documents, setDocuments] = useAtom(documentAtom);

  useEffect(() => {
    return () => {
      setLinks([]);
      setDocuments([]);
    };
  }, []);

  return (
    <Card className="overflow-hidden border border-neutral-300 bg-neutral-100">
      <CardHeader className="bg-neutral-200 py-3 space-y-0">
        <CardTitle className="text-lg">Submit your work</CardTitle>
        <CardDescription>
          Attach files or links to submit your work.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2 pt-6 pb-3">
        <div className="text-sm text-muted-foreground">
          {/* <p className="font-semibold tracking-tight">Your work</p> */}
          {links.length === 0 && documents.length === 0 ? (
            <p className="text-xs text-center">No work attached yet.</p>
          ) : (
            <>
              {documents.map((document) => (
                <div
                  key={document.url}
                  className="rounded-lg border-border py-1 px-2 bg-neutral-200"
                >
                  {document.label ?? "Untitled Document"}
                </div>
              ))}
              {links.map((link) => (
                <div
                  key={link.url}
                  className="rounded-lg border-border py-1 px-2 bg-neutral-200"
                >
                  {link.label ?? "Untitled Link"}
                </div>
              ))}
            </>
          )}
        </div>
      </CardContent>
      <CardFooter className="py-3 flex gap-x-2">
        <Button className="h-8 text-xs w-full" variant="outline">
          Attach Files
        </Button>
        <Button className="h-8 text-xs w-full">Submit Assignment</Button>
      </CardFooter>
    </Card>
  );
};

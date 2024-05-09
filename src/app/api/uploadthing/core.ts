import { getToken } from "next-auth/jwt";
import { createUploadthing, type FileRouter } from "uploadthing/next";

import { ratelimit } from "@/server/ratelimit";

const f = createUploadthing();

export const ourFileRouter = {
  imageUpLoader: f({
    image: { maxFileSize: "4MB" },
    pdf: { maxFileSize: "4MB" },
    video: { maxFileSize: "4MB" },
    text: { maxFileSize: "4MB" },
    audio: { maxFileSize: "4MB" },
    blob: { maxFileSize: "4MB" },
  })
    .middleware(async ({ req }) => {
      const user = await getToken({ req });

      if (!user) throw new Error("Unauthorized");

      const { success } = await ratelimit.limit(user.id);

      if (!success) throw new Error("Rate limit exceeded");

      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {}),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;

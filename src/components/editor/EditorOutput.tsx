"use client";
import Image from "next/image";
import dynamic from "next/dynamic";

import { useMounted } from "@/hooks/use-mounted";
import { EditorSkeleton } from "@/components/skeletons/editor-skeleton";

const Output = dynamic(
  async () => (await import("editorjs-react-renderer")).default,
  {
    ssr: false,
  }
);

const style = {
  paragraph: {
    fontSize: "0.9rem",
    lineHeight: "1.25rem",
  },
};

const renderers = {
  image: CustomImageRenderer,
  code: CustomCodeRenderer,
};

export const EditorOutput = (props: { content: any }) => {
  const { content } = props;
  const mounted = useMounted();

  if (!mounted) return <EditorSkeleton />;

  return <Output data={content} style={style} renderers={renderers} />;
};

function CustomImageRenderer({ data }: any) {
  const src = data.file.url;

  return (
    <div className="relative w-full min-h-[15rem]">
      <Image src={src} alt="editor-content" className="object-contain" fill />
    </div>
  );
}

function CustomCodeRenderer({ data }: any) {
  return (
    <pre className="bg-gray-800 rounded-md p-4">
      <code className="text-gray-100 text-sm">{data.code}</code>
    </pre>
  );
}

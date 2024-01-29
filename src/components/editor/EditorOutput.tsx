"use client";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { AlertTriangle, ArrowUpRight, File } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useMounted } from "@/hooks/use-mounted";
import { Checkbox } from "@/components/ui/checkbox";
import { EditorSkeleton } from "@/components/skeletons/editor-skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

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
  attaches: CustomAttachmentRenderer,
  table: CustomTableRenderer,
  link: CustomLinkRenderer,
  list: CustomListRenderer,
  raw: CustomRawRenderer,
  delimiter: CustomDelimiterRenderer,
  checklist: CustomCheckListRenderer,
  quote: CustomQuoteRenderer,
  warning: CustomWarningRenderer,
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

function CustomAttachmentRenderer({ data }: any) {
  return (
    <Link
      href={data.file.url}
      target="_blank"
      className="border border-neutral-300 rounded-md my-4 py-2 px-2 text-sm flex justify-between items-center group"
    >
      <div className="flex items-center gap-x-2">
        <File className="text-muted-foreground h-4 w-4" />
        <p>{data.title}</p>
      </div>
      <ArrowUpRight className="text-muted-foreground h-4 w-4 hidden transition group-hover:block" />
    </Link>
  );
}

function CustomTableRenderer({ data }: any) {
  const { content } = data;
  const headings = content[0] as string[];
  const rows = content.slice(1) as string[][];

  return (
    <Table>
      <TableHeader>
        <TableRow className="border-neutral-300">
          {headings.map((heading, index) => (
            <TableHead key={index}>{heading}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((item, index) => (
          <TableRow key={index}>
            {item.map((cell, i) => (
              <TableCell key={i}>{cell}</TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function CustomLinkRenderer({ data }: any) {
  console.log("link data", data);

  return <p>Link</p>;
}

function CustomListRenderer({ data }: any) {
  return (
    <ol>
      {data.items.map((item: any, index: number) => (
        <li
          key={index}
          className="list-decimal list-inside font-medium text-gray-800 text-sm"
        >
          {item}
        </li>
      ))}
    </ol>
  );
}

function CustomRawRenderer({ data }: any) {
  return (
    <pre className="bg-gray-800 rounded-md p-4">
      <code className="text-gray-200 text-sm">{data.html}</code>
    </pre>
  );
}

function CustomDelimiterRenderer({ data }: any) {
  return (
    <div className="my-4 text-muted-foreground text-sm flex items-center justify-center gap-x-4">
      <span>⁎</span>
      <span>⁎</span>
      <span>⁎</span>
      <span>⁎</span>
      <span>⁎</span>
    </div>
  );
}

function CustomCheckListRenderer({ data }: any) {
  const { items } = data;

  type Item = {
    checked: boolean;
    text: string;
  };

  return (
    <div className="flex flex-col gap-y-2 text-sm">
      {items.map((item: Item, index: number) => (
        <div key={index} className="flex items-center gap-x-2">
          <Checkbox checked={item.checked} />
          <p>{item.text}</p>
        </div>
      ))}
    </div>
  );
}

function CustomQuoteRenderer({ data }: any) {
  return (
    <div className="flex justify-center">
      <blockquote>
        <p className="text-lg font-medium text-gray-800">{data.text}</p>
        <cite className="text-sm text-gray-500">{data.caption}</cite>
      </blockquote>
    </div>
  );
}

function CustomWarningRenderer({ data }: any) {
  return (
    <Alert className="bg-yellow-100/60">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>{data.title}</AlertTitle>
      <AlertDescription>{data.message}</AlertDescription>
    </Alert>
  );
}

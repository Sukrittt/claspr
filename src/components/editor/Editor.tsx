import { useAtom } from "jotai";
import { motion } from "framer-motion";
import EditorJS from "@editorjs/editorjs";
import { ClassRoom } from "@prisma/client";
import { useCallback, useEffect, useRef } from "react";

import { uploadFiles } from "@/lib/uploadthing";
import { useMounted } from "@/hooks/use-mounted";
import { ContainerHeightVariants } from "@/lib/motion";
import { contentAtom, isSubmittingAtom } from "@/atoms";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AIDialog } from "@/components/conversation/ai-dialog";

interface EditorProps {
  classroom: ClassRoom;
  title?: string;
  content?: any;
}

export const Editor: React.FC<EditorProps> = ({
  classroom,
  title,
  content,
}) => {
  const ref = useRef<EditorJS>();
  const mounted = useMounted();

  const [isSubmitting, setIsSubmitting] = useAtom(isSubmittingAtom);
  const [, setContent] = useAtom(contentAtom);

  const initializeEditor = useCallback(async () => {
    const EditorJS = (await import("@editorjs/editorjs")).default;
    //@ts-ignore
    const Header = (await import("@editorjs/header")).default;
    //@ts-ignore
    const Embed = (await import("@editorjs/embed")).default;
    //@ts-ignore
    const Table = (await import("@editorjs/table")).default;
    //@ts-ignore
    const NestedList = (await import("@editorjs/nested-list")).default;
    //@ts-ignore
    const Code = (await import("@editorjs/code")).default;
    //@ts-ignore
    const LinkTool = (await import("@editorjs/link")).default;
    //@ts-ignore
    const InlineCode = (await import("@editorjs/inline-code")).default;
    //@ts-ignore
    const ImageTool = (await import("@editorjs/image")).default;
    //@ts-ignore
    const CheckList = (await import("@editorjs/checklist")).default;
    //@ts-ignore
    const Quote = (await import("@editorjs/quote")).default;
    //@ts-ignore
    const Delimiter = (await import("@editorjs/delimiter")).default;
    //@ts-ignore
    const Raw = (await import("@editorjs/raw")).default;
    //@ts-ignore
    const Attach = (await import("@editorjs/attaches")).default;
    //@ts-ignore
    const Warning = (await import("@editorjs/warning")).default;

    if (!ref.current) {
      const editor = new EditorJS({
        holder: "editor",
        onReady() {
          ref.current = editor;
        },
        autofocus: true,

        placeholder:
          "Provide concise instructions and details for your assignment here.",
        inlineToolbar: true,
        data: { blocks: content.blocks ?? [] },
        tools: {
          header: {
            class: Header,
            config: {
              levels: [1, 2, 3, 4],
              defaultLevel: 2,
              shortcut: "CMD+H",
            },
          },
          linkTool: {
            class: LinkTool,
            shortcut: "CMD+L",
            config: {
              endpoint: "/api/link",
            },
          },
          image: {
            class: ImageTool,
            shortcut: "CMD+I",
            config: {
              types: "image/*",
              uploader: {
                async uploadByFile(file: File) {
                  const res = await uploadByFile(file);

                  return {
                    success: 1,
                    file: {
                      url: res.url,
                    },
                  };
                },
              },
            },
          },
          attaches: {
            class: Attach,
            config: {
              types: "image/*, video/*, application/pdf, .doc, .docx",
              uploader: {
                async uploadByFile(file: File) {
                  const res = await uploadByFile(file);

                  return {
                    success: 1,
                    file: {
                      url: res.url,
                    },
                  };
                },
              },
            },
          },
          checklist: CheckList,
          quote: Quote,
          warning: Warning,
          delimiter: Delimiter,
          raw: Raw,
          list: {
            class: NestedList,
            inlineToolbar: true,
            config: {
              defaultStyle: "ordered",
            },
          },
          code: Code,
          inlineCode: {
            class: InlineCode,
            shortcut: "CMD+SHIFT+C",
          },
          table: Table,
          embed: {
            class: Embed,
            shortcut: "CMD+E",
          },
        },
      });
    }
  }, []);

  const insertBlock = (text: string) => {
    const formattedText = text.replace(/\n/g, "<br>");

    ref.current?.caret.setToNextBlock();
    ref.current?.blocks.insert("paragraph", { text: formattedText });
  };

  async function uploadByFile(file: File) {
    // upload to uploadthing
    const [res] = await uploadFiles("imageUploader", {
      files: [file],
    });

    return {
      url: res.url,
    };
  }

  useEffect(() => {
    const init = async () => {
      await initializeEditor();
    };

    if (mounted) {
      init();

      return () => {
        ref.current?.destroy();
        ref.current = undefined;
      };
    }
  }, [mounted, initializeEditor]);

  const saveEditorData = async () => {
    const blocks = await ref.current?.save();

    setContent(blocks);
    setIsSubmitting(false);
  };

  useEffect(() => {
    if (isSubmitting) {
      saveEditorData();
    }
  }, [isSubmitting]);

  if (!mounted) {
    return <p>Just a moment...</p>;
  }

  const addInfo = `This is the title given by the teacher for this assignment: ${title}.`;

  return (
    <>
      <motion.div
        variants={ContainerHeightVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        id="editor"
        className="px-4 typography-styles"
      />

      <AIDialog
        temperature={0.7}
        classroom={classroom}
        moveToEditor={insertBlock}
        personal="QUESTION_EXPERT"
        addInfo={addInfo}
      />
    </>
  );
};

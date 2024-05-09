import { toast } from "sonner";
import { useAtom } from "jotai";
import { motion } from "framer-motion";
import EditorJS from "@editorjs/editorjs";
import { ClassRoom } from "@prisma/client";
import { useCallback, useEffect, useRef } from "react";

import { cn } from "@/lib/utils";
import { ExtendedNote } from "@/types";
import { FormattedNote } from "@/types/note";
import { uploadFiles } from "@/lib/uploadthing";
import { useMounted } from "@/hooks/use-mounted";
import { NoteAi } from "@/components/note/note-ai";
import { ContainerHeightVariants } from "@/lib/motion";
import { contentAtom, isSubmittingAtom } from "@/atoms";
import { AIDialog } from "@/components/conversation/ai-dialog";

import "./editor.css";

interface EditorProps {
  classroom?: Pick<ClassRoom, "id" | "title" | "description">;
  note?: ExtendedNote | FormattedNote;
  title?: string;
  content?: any;
  disableAI?: boolean;
  disableAutofocus?: boolean;
  placeholder?: string;
  disableFollowUp?: boolean;
  getDebouncedContent?: boolean;
  isNotePage?: boolean;
  customAiTrigger?: JSX.Element;
}

export const Editor: React.FC<EditorProps> = ({
  classroom,
  note,
  title,
  content,
  disableAI = false,
  disableAutofocus = false,
  disableFollowUp = false,
  isNotePage = false,
  getDebouncedContent,
  placeholder,
  customAiTrigger,
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
        onChange: () => {
          if (getDebouncedContent) {
            setIsSubmitting(true);
          }
        },
        autofocus: !disableAutofocus,

        placeholder:
          placeholder ??
          "Provide concise instructions and details for your assignment here.",
        inlineToolbar: true,
        data: { blocks: content?.blocks ?? [] },
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
              onError: () => {
                console.log("Error in link upload");
              },
            },
          },
          image: {
            class: ImageTool,
            shortcut: "CMD+I",
            config: {
              types: "image/*",
              uploader: {
                async uploadByFile(file: File) {
                  try {
                    const res = await uploadByFile(file);

                    return {
                      success: 1,
                      file: {
                        url: res.url,
                      },
                    };
                  } catch (error) {
                    toast.error("An error occurred while uploading your image");
                  }
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
                  try {
                    const res = await uploadByFile(file);

                    return {
                      success: 1,
                      file: {
                        url: res.url,
                      },
                    };
                  } catch (error) {
                    toast.error("An error occurred while uploading your file");
                  }
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
    const [res] = await uploadFiles("imageUpLoader", {
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
    return (
      <p className="pl-4 text-muted-foreground text-sm">Just a moment...</p>
    );
  }

  const addInfo = `This is the title given by the teacher for this assignment: ${title}.`;

  return (
    <div>
      <motion.div
        variants={ContainerHeightVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        id="editor"
        className={cn("px-4 typography-styles max-w-full", {
          "pl-0 lg:pl-12": isNotePage,
        })}
      />

      {!disableAI && !isNotePage
        ? classroom && (
            <AIDialog
              hasFollowUp={!disableFollowUp}
              temperature={0.7}
              classroom={classroom}
              moveToEditor={insertBlock}
              personal="QUESTION_EXPERT"
              addInfo={addInfo}
            />
          )
        : note && (
            <NoteAi
              moveToEditor={insertBlock}
              note={note}
              temperature={0.2}
              customAiTrigger={customAiTrigger}
            />
          )}
    </div>
  );
};

import { z } from "zod";
import { toast } from "sonner";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { trpc } from "@/trpc/client";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { ContainerHeightVariants } from "@/lib/motion";
import { CustomTooltip } from "@/components/custom/custom-tooltip";

const classCreationSchema = z.object({
  title: z
    .string()
    .min(1)
    .max(50)
    .refine(
      (val) => {
        return val.trim().length > 0;
      },
      { message: "Class name cannot be empty" }
    ),
  protectedDomain: z.string().optional(),
});

type Inputs = z.infer<typeof classCreationSchema>;

export const CreateClassForm = ({ sectionId }: { sectionId: string }) => {
  const router = useRouter();
  const [isDomainProtectionEnabled, setIsDomainProtectionEnabled] =
    useState(false);

  // react-hook-form
  const form = useForm<Inputs>({
    resolver: zodResolver(classCreationSchema),
    defaultValues: {
      title: "",
    },
  });

  const { mutate: createClass, isLoading } = trpc.class.createClass.useMutation(
    {
      onSuccess: (classRoom) => {
        router.push(`/c/${classRoom.id}`);
      },
      onMutate: () => {
        toast.loading("Just a moment...", { duration: 1000 });
      },
    }
  );

  function handleCreateClass(data: Inputs) {
    createClass({
      ...data,
      sectionId,
    });
  }

  function onSubmit(data: Inputs) {
    handleCreateClass(data);
  }

  return (
    <div className="space-y-2">
      <Form {...form}>
        <form
          id="class-creation-form"
          onSubmit={(...args) => void form.handleSubmit(onSubmit)(...args)}
          className="space-y-4 overflow-hidden"
        >
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between pt-1 pr-1">
                  <FormLabel>Name</FormLabel>
                  <CustomTooltip text="Enable domain protection">
                    <div>
                      <Switch
                        id="protected-domain"
                        checked={isDomainProtectionEnabled}
                        onCheckedChange={(val) =>
                          setIsDomainProtectionEnabled(val)
                        }
                      />
                    </div>
                  </CustomTooltip>
                </div>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="E.g: Science Class"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div>
            <AnimatePresence mode="wait">
              {isDomainProtectionEnabled && (
                <motion.div
                  variants={ContainerHeightVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="pb-2"
                >
                  <FormField
                    control={form.control}
                    name="protectedDomain"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Domain</FormLabel>
                        <FormControl>
                          <>
                            <Input
                              type="text"
                              placeholder="E.g: gmail.com"
                              {...field}
                            />
                            <FormDescription className="text-xs">
                              Only users with this email domain are permitted to
                              join this classroom.
                            </FormDescription>
                          </>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </form>
      </Form>
      <Button
        className="mb-1 w-full"
        form="class-creation-form"
        disabled={isLoading}
      >
        {isLoading ? (
          <Loader2 className="h-3 w-3 animate-spin" aria-hidden="true" />
        ) : (
          "Create Class"
        )}
        <span className="sr-only">Create Class</span>
      </Button>
    </div>
  );
};

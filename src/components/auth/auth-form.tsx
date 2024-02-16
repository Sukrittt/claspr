"use client";
import { z } from "zod";
import { toast } from "sonner";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { trpc } from "@/trpc/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PasswordInput } from "./password-input";

const authSchema = z.object({
  name: z.string().min(2).max(50).optional(),
  email: z.string().email(),
  password: z
    .string()
    .min(8, {
      message: "Password must be at least 8 characters long",
    })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/, {
      message:
        "Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special character",
    })
    .refine((val) => {
      return val.trim().length > 0;
    })
    .refine(
      (val) => {
        return val.trim().length > 0;
      },
      { message: "Password cannot be empty" }
    ),
});

type Inputs = z.infer<typeof authSchema>;

interface AuthFormProps {
  authType: "signin" | "signup";
}

export const AuthForm: React.FC<AuthFormProps> = ({ authType }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // react-hook-form
  const form = useForm<Inputs>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { mutate: handleRouting } = trpc.user.getUserRoleByEmail.useMutation({
    onSuccess: async (userRole) => {
      let url = "/dashboard";

      if (!userRole) {
        url = "/onboarding";
      }

      router.push(url);
    },
  });

  const handleSignIn = async (data: Inputs) => {
    try {
      setIsLoading(true);
      const payload = { email: data.email, password: data.password };

      const res = await signIn("credentials", {
        ...payload,
        redirect: false,
      });

      if (res?.status === 401) {
        toast.error("The email or password you entered is incorrect");
        return;
      }

      if (res?.ok) {
        handleRouting({ email: data.email });
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRedirection = (email: string) => {};

  const { mutate: registerUser, isLoading: isRegistering } =
    trpc.user.registerUser.useMutation({
      onSuccess: async (_, data) => {
        toast.success("Account created successfully");
        const payload = { email: data.email, password: data.password };

        await handleSignIn(payload);
      },
    });

  function onSubmit(data: Inputs) {
    if (authType === "signup") {
      if (!data.name) {
        toast.error("Your name is required");
        return;
      }

      const payload = { ...data, name: data.name.trim() };

      registerUser(payload);
    } else {
      handleSignIn(data);
    }
  }

  return (
    <Form {...form}>
      <form
        className="grid gap-4"
        onSubmit={(...args) => void form.handleSubmit(onSubmit)(...args)}
      >
        {authType === "signup" && (
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Rodney Mullen" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="rodneymullen180@gmail.com"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <PasswordInput placeholder="**********" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading || isRegistering}>
          {(isLoading || isRegistering) && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
          )}
          {authType === "signin" ? "Sign in" : "Sign up"}
          <span className="sr-only">
            {authType === "signin" ? "Sign In" : "Sign Up"}
          </span>
        </Button>
      </form>
    </Form>
  );
};

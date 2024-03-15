import Link from "next/link";
import Image from "next/image";

import { AuthForm } from "@/components/auth/auth-form";
import { OAuthSignIn } from "@/components/auth/oauth-sign-in";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface AuthCardProps {
  authType: "signin" | "signup";
}

export const AuthCard: React.FC<AuthCardProps> = ({ authType }) => {
  return (
    <div className="h-screen flex">
      <div className="w-[35%]">
        <Card className="h-full flex flex-col justify-center px-20">
          <CardHeader className="space-y-1 px-0">
            <CardTitle className="text-xl">
              {authType === "signin" ? "Welcome Back" : "Sign up"}
            </CardTitle>
            <CardDescription>
              Choose your preferred{" "}
              {authType === "signin" ? "sign in" : "sign up"} method
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 px-0">
            <OAuthSignIn />
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>
            <AuthForm authType={authType} />
          </CardContent>
          <CardFooter className="flex flex-wrap items-center justify-between gap-2 px-0">
            <div className="text-sm text-muted-foreground">
              <span className="mr-1 hidden sm:inline-block">
                {authType === "signin"
                  ? "Don't have an account?"
                  : "Already have an account?"}
              </span>
              <Link
                aria-label={authType === "signin" ? "Sign up" : "Sign in"}
                href={authType === "signin" ? "/sign-up" : "/sign-in"}
                className="text-primary underline-offset-4 transition-colors hover:underline"
              >
                {authType === "signin" ? "Sign up" : "Sign in"}
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
      <div className="flex-1 relative bg-primary dark:bg-neutral-800 flex items-center justify-center">
        <div className="space-y-2 w-1/2">
          <div className="h-10 w-10 absolute -ml-10">
            <Image src="/image.png" alt="quotes" fill priority />
          </div>
          <h1 className="text-7xl font-bold text-neutral-200 leading-tight">
            I am not a teacher, but an awakener.
          </h1>

          <p className="text-neutral-200 dark:text-foreground font-medium">
            ⁓ Robert Frost
          </p>
        </div>
      </div>
    </div>
  );
};

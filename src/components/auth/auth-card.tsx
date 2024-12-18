import Link from "next/link";

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
import { RandomizedQuote } from "./randomized-quote";

interface AuthCardProps {
  authType: "signin" | "signup";
}

export const AuthCard: React.FC<AuthCardProps> = ({ authType }) => {
  return (
    <div className="h-screen flex">
      <div className="w-full xl:w-[35%]">
        <Card className="h-full flex flex-col justify-center px-10 sm:px-20">
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
              <span className="mr-1">
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
      <div className="hidden flex-1 relative bg-primary dark:bg-neutral-800 xl:flex items-center justify-center">
        <RandomizedQuote />
      </div>
    </div>
  );
};

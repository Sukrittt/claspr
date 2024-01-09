import { AuthForm } from "@/components/auth-form";
import Image from "next/image";

export default function SignIn() {
  return (
    <div className="h-screen flex">
      <div className="flex flex-col gap-y-4 items-center justify-center w-1/2">
        <div className="space-y-1 text-center">
          <h1 className="text-lg font-semibold">Welcome to Scribe.</h1>
          <p className="text-muted-foreground text-sm">
            Choose your preferred sign in method
          </p>
        </div>
        <AuthForm />
      </div>
      <div className="w-1/2 relative bg-[#0a0e19] flex items-center px-52">
        <div className="space-y-2">
          <div className="h-10 w-10 absolute -ml-10">
            <Image src="/image.png" alt="quotes" fill />
          </div>
          <h1 className="text-7xl font-bold text-slate-200 leading-tight">
            I am not a teacher, but an awakener.
          </h1>

          <p className="text-slate-200 font-medium">⁓ Robert Frost</p>
        </div>
      </div>
    </div>
  );
}

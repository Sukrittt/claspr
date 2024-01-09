import { AuthForm } from "@/components/auth-form";

export default function SignIn() {
  return (
    <div className="h-screen flex">
      <div className="bg-zinc-200 w-2/3" />
      <div className="flex flex-col gap-y-4 items-center justify-center w-1/3">
        <h1 className="text-lg font-semibold">Welcome to SCRiBE</h1>
        <AuthForm />
      </div>
    </div>
  );
}

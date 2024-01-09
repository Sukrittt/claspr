import { Button } from "@/components/ui/button";

export const AuthForm = () => {
  return (
    <div className="flex flex-col gap-y-2 w-3/4">
      <Button variant="outline">Google</Button>
      <Button variant="outline">Github</Button>
    </div>
  );
};

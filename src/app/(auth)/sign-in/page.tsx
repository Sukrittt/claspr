import { AuthCard } from "@/components/auth/auth-card";
import { SITE_DESCRIPTION, SITE_TITLE } from "@/config/site";

export async function generateMetadata() {
  return {
    title: SITE_TITLE.SIGN_IN,
    description: SITE_DESCRIPTION.SIGN_IN,
  };
}

export default function SignIn() {
  return <AuthCard authType="signin" />;
}

import { AuthCard } from "@/components/auth/auth-card";
import { SITE_DESCRIPTION, SITE_TITLE } from "@/config/site";

export async function generateMetadata() {
  return {
    title: SITE_TITLE.SIGN_UP,
    description: SITE_DESCRIPTION.SIGN_UP,
  };
}

export default function SignUp() {
  return <AuthCard authType="signup" />;
}

"use server";
import { Resend } from "resend";
import { render } from "@react-email/render";

import VercelInviteUserEmail from "../../emails/vercel-invite-user";

const resend = new Resend(process.env.RESEND_API_KEY);

type EmailProps = {
  from: string;
  to: string;
  subject: string;
  //   react: React.JSX.Element;
};

export const sendEmail = async (props: EmailProps) => {
  const { from, to, subject } = props;

  try {
    await resend.emails.send({
      from: "Sukrit <sukrit@otakusphere.in>",
      to: [to],
      subject,
      html: render(
        VercelInviteUserEmail({
          invitedByEmail: "Acme <onboarding@resend.dev>",
          invitedByUsername: "Sukrit Saha",
          teamName: "Scribe",
          username: "sukrit04",
        })
      ),
    });

    console.log("Email sent successfully");
  } catch (error) {
    console.error(error);
  }
};

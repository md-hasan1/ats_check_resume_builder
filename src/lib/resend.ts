import { Resend } from "resend";
import { env } from "@/lib/env";

export const resend = new Resend(
  env.resendApiKey || "re_placeholder_key_for_build"
);

const fromEmail = env.resendFromEmail || "noreply@resumeai.com";

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  return resend.emails.send({
    from: fromEmail,
    to,
    subject,
    html,
  });
}

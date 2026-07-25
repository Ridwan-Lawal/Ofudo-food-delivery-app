import { Resend } from "resend";
import { renderOtpEmail } from "../emails/otp-email";

const resend = new Resend(process.env.RESEND_KEY);

export async function sendVerificationOtp({ to, otp }: { to: string; otp: string }) {
  const { error } = await resend.emails.send({
    from: "noreply@lawalridwan.me",
    to,
    subject: "Verify your OTP",
    html: renderOtpEmail({ otp }),
  });

  if (error) {
    if (__DEV__) {
      console.error("Resend error:", error);
    }
  }
}

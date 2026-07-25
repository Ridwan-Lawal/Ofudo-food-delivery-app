import { palette, radius } from "@/theme/tokens";

const FONT_STACK =
  "'Quicksand',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";

export interface OtpEmailOptions {
  /** The one-time verification code to display. */
  otp: string;
  /** Product/brand name shown in the header + footer. */
  appName?: string;
  /** How long the code stays valid, in minutes. */
  expiryMinutes?: number;
}

/**
 * Renders the OTP verification email as an inline-styled HTML string.
 * Colors + radii come from the design system (@/theme/tokens); Quicksand is
 * loaded from Google Fonts with a web-safe fallback for clients that block it.
 *
 * Usage with better-auth's emailOTP plugin (src/lib/auth.ts):
 *
 *   emailOTP({
 *     async sendVerificationOTP({ email, otp }) {
 *       await sendEmail({
 *         to: email,
 *         subject: "Your Ofudo verification code",
 *         html: renderOtpEmail({ otp }),
 *       });
 *     },
 *   })
 */
export function renderOtpEmail({
  otp,
  appName = "Ofudo",
  expiryMinutes = 10,
}: OtpEmailOptions): string {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="color-scheme" content="light" />
    <title>${appName} verification code</title>
    <link
      href="https://fonts.googleapis.com/css2?family=Quicksand:wght@500;600;700&display=swap"
      rel="stylesheet"
    />
  </head>
  <body style="margin:0;padding:0;background-color:#f5f5f5;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;">
      Your ${appName} verification code is ${otp}. It expires in ${expiryMinutes} minutes.
    </div>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f5f5;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;background-color:${palette.white};border-radius:${radius.lg}px;overflow:hidden;font-family:${FONT_STACK};">
            <tr>
              <td style="padding:32px 32px 8px;">
                <div style="font-family:${FONT_STACK};font-weight:700;font-size:22px;color:${palette.orange};">${appName}</div>
              </td>
            </tr>
            <tr>
              <td style="padding:8px 32px 0;">
                <h1 style="margin:0;font-family:${FONT_STACK};font-weight:700;font-size:24px;line-height:1.3;color:${palette.ink};">Verify your email</h1>
              </td>
            </tr>
            <tr>
              <td style="padding:12px 32px 0;">
                <p style="margin:0;font-family:${FONT_STACK};font-weight:500;font-size:16px;line-height:1.6;color:${palette.bodyGray};">
                  Welcome! Use the code below to verify your email address and finish setting up your account.
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:24px 32px;">
                <div style="background-color:${palette.orangeTint};border:1.5px solid ${palette.orange};border-radius:${radius.md}px;padding:20px;text-align:center;">
                  <div style="font-family:${FONT_STACK};font-weight:700;font-size:34px;letter-spacing:10px;color:${palette.ink};">${otp}</div>
                </div>
              </td>
            </tr>
            <tr>
              <td style="padding:0 32px;">
                <p style="margin:0;font-family:${FONT_STACK};font-weight:500;font-size:14px;line-height:1.6;color:${palette.labelGray};">
                  This code expires in ${expiryMinutes} minutes. If you didn't create a ${appName} account, you can safely ignore this email.
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:28px 32px 32px;">
                <hr style="border:none;border-top:1px solid #eeeeee;margin:0 0 16px;" />
                <p style="margin:0;font-family:${FONT_STACK};font-weight:500;font-size:12px;line-height:1.5;color:${palette.labelGray};">
                  &copy; ${new Date().getFullYear()} ${appName}. All rights reserved.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

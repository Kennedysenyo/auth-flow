"use server";

import WelcomEmail from "@/emails/Welcome";
import { handleError } from "@/lib/error/handle-error";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);

export const SendWelcomeEmail = async (
  email: string,
  name: string
): Promise<string | null> => {
  try {
    console.log("this is the email received for sending", email);
    const { data, error } = await resend.emails.send({
      from: "KenCoding <onboarding@resend.dev>",
      to: [email],
      subject: "Welcome to KenCoding",
      react: WelcomEmail({ name }),
    });

    if (!data || error) throw error;
    return null;
  } catch (error) {
    return handleError(error);
  }
};

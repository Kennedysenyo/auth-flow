"use server";

import WelcomEmail from "@/emails/Welcome";
import { handleError } from "@/lib/error/handle-error";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);

export const SendWelcomeEmail = async (
  name: string
): Promise<string | null> => {
  try {
    const { data, error } = await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: ["contact@kencoding.dev"],
      subject: "Hello world",
      react: WelcomEmail({ name: "John" }),
    });
    if (error) throw error;
    return null;
  } catch (error) {
    return handleError(error);
  }
};

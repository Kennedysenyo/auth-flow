"use server";

import { generateOTP } from "@/lib/otp/generate";
import { isCorrectFormat } from "@/utils/input-format";
import { cookies } from "next/headers";

type Errors = {
  email?: string;
};

export type ForgotPasswordFormState = {
  error: Errors;
  success: boolean;
  errorMessage: string | null;
};

export const validateForgotPasswordForm = async (
  prevState: ForgotPasswordFormState,
  formData: FormData
): Promise<ForgotPasswordFormState> => {
  const email = formData.get("email") as string;
  const error: Errors = {};

  if (!email) error.email = "Email is required";
  else if (!isCorrectFormat("email", email)) error.email = "Enter valid email";

  if (Object.keys(error).length > 0)
    return { error, success: false, errorMessage: null };

  const errorMessage: string | null = await generateOTP("recovery", email);
  if (errorMessage) return { error: {}, success: false, errorMessage };

  const cookieStore = await cookies();
  cookieStore.set("email", email, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 15 * 60,
    path: "/",
  });
  cookieStore.set("recovery-mode", "true", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 15 * 60,
    path: "/",
  });

  return { error: {}, success: true, errorMessage: null };
};

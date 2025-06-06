"use server";

import { VerifyOtp } from "@/lib/otp/verify-otp";
import { redis } from "@/lib/redis/redis";
import { isCorrectFormat } from "@/utils/input-format";
import { cookies } from "next/headers";

type Errors = {
  token?: string;
};
export type VerifyTokeFormState = {
  error: Errors;
  success: boolean;
  errorMessage: string | null;
};
export const validateOtpForm = async (
  { email, type }: { email: string; type: "signup" | "recovery" },
  prevState: VerifyTokeFormState,
  formData: FormData
): Promise<VerifyTokeFormState> => {
  const token = (formData.get("token") as string).trim();

  const error: Errors = {};

  if (!token) error.token = "Token is required";
  else if (typeof Number(token) !== "number") error.token = "Invalid token";

  if (Object.keys(error).length > 0)
    return { error, success: false, errorMessage: null };

  if (!isCorrectFormat("email", email))
    return {
      error: {},
      success: false,
      errorMessage: "Error!, restart signup process",
    };
  const errorMessage = await VerifyOtp(type, email, token);
  if (errorMessage) return { error: {}, success: false, errorMessage };

  if (type === "signup") {
    const cookieStore = await cookies();
    const signupToken = cookieStore.get("signup");
    await redis.del(`signup_token:${signupToken}`);
    cookieStore.delete("signup");
  }

  return {
    error: {},
    success: true,
    errorMessage: null,
  };
};

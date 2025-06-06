"use server";

import { handleError } from "@/lib/error/handle-error";
import { generateOTP } from "@/lib/otp/generate";
import { redis } from "@/lib/redis/redis";
import { createClient } from "@/lib/supabase/server";
import { isCorrectFormat } from "@/utils/input-format";
import { hash } from "bcryptjs";
import { cookies } from "next/headers";

type MissingFields = {
  email?: string;
  password?: string;
  confirmPassword?: string;
};

export type FormState = {
  inputErrors: MissingFields;
  success: boolean;
  errorMessage: string | null;
};

const loginAction = async (
  email: string,
  password: string
): Promise<string | null> => {
  try {
    const { auth } = await createClient();
    const { data, error } = await auth.signInWithPassword({ email, password });
    if (error) throw error;
    return null;
  } catch (error) {
    return handleError(error);
  }
};

export const submitAction = async (
  isLogin: boolean,
  prevState: FormState,
  formData: FormData
): Promise<FormState> => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const confirmPassword = !isLogin
    ? (formData.get("password") as string)
    : undefined;

  // Form Validation
  const inputErrors: MissingFields = {};
  if (!email) inputErrors.email = "Email is required";
  else if (!isCorrectFormat("email", email))
    inputErrors.email = "Enter a valid email";

  if (!password) inputErrors.password = "Password is required";
  else if (!isLogin && !isCorrectFormat("password", password))
    inputErrors.password =
      "Password MUST be at least 8 characters and  contain atleast one uppercase, one lowercase, one number and a special character";

  if (!isLogin) {
    if (!confirmPassword) inputErrors.confirmPassword = "Password required";
    else if (confirmPassword !== password)
      inputErrors.confirmPassword = "Password doesn't match";
  }

  if (Object.keys(inputErrors).length > 0) {
    return { inputErrors, success: false, errorMessage: null };
  }

  // Login / Signup
  const errorMessage = isLogin
    ? await loginAction(email, password)
    : await generateOTP("signup", email, password);
  if (errorMessage) {
    return { inputErrors: {}, success: false, errorMessage };
  }

  if (!isLogin) {
    const hashedPassword = await hash(password, 10);

    const token = crypto.randomUUID();
    console.log("The redis token is ", token);
    await redis.set(
      `signup_token:${token}`,
      JSON.stringify({ email, hashedPassword }),
      { ex: 15 * 60 }
    );

    const cookieStore = await cookies();
    cookieStore.set("signup", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 15 * 60,
      path: "/",
    });
    cookieStore.set("email", email, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 15 * 60,
      path: "/",
    });
  }

  return {
    inputErrors: {},
    success: true,
    errorMessage: null,
  };
};

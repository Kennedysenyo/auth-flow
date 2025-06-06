"use server";

import { handleError } from "@/lib/error/handle-error";
import { createClient } from "@/lib/supabase/server";
import { isCorrectFormat } from "@/utils/input-format";
import { cookies } from "next/headers";

type FormErrors = {
  password?: string;
  confirmPassword?: string;
};

export type NewPaswordFormState = {
  errors: FormErrors;
  success: boolean;
  errorMessage: string | null;
};

const updatePassword = async (password: string): Promise<string | null> => {
  try {
    const { auth } = await createClient();
    const { error } = await auth.updateUser({ password });
    if (error) throw new Error(error.message);
    const cookieStore = await cookies();
    if (cookieStore.has("recovery-mode")) {
      cookieStore.delete("recovery-mode");
    }
    const { error: logoutError } = await auth.signOut();
    if (logoutError) throw new Error(logoutError?.message);
    return null;
  } catch (error) {
    return handleError(error);
  }
};

export const validateNewPaswordForm = async (
  prevState: NewPaswordFormState,
  formData: FormData
): Promise<NewPaswordFormState> => {
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirm-password") as string;

  const errors: FormErrors = {};

  if (!password) errors.password = "Password is required";
  else if (!isCorrectFormat("password", password))
    errors.password =
      "Password MUST be at least 8 characters and  contain atleast one uppercase, one lowercase, one number and a special character";
  if (!confirmPassword) errors.confirmPassword = "Confirm password";
  else if (password !== confirmPassword)
    errors.confirmPassword = "Passwords do not match";

  if (Object.keys(errors).length > 0)
    return { errors, success: false, errorMessage: null };

  const errorMessage = await updatePassword(password);
  if (errorMessage) return { errors: {}, success: false, errorMessage };

  return { errors: {}, success: true, errorMessage: null };
};

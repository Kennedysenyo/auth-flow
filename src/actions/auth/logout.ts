"use server";

import { handleError } from "@/lib/error/handle-error";
import { createClient } from "@/lib/supabase/server";

/**
 * Logs the user out using Supabase's server-side auth client.
 * Returns null on success, or an error message on failure.
 */

export const logoutAction = async (): Promise<string | null> => {
  try {
    const { auth } = await createClient();
    const { error } = await auth.signOut();
    if (error) throw error;
    return null;
  } catch (error) {
    return handleError(error);
  }
};

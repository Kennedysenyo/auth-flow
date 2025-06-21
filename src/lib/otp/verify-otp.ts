import { isCorrectFormat } from "@/utils/input-format";
import { handleError } from "../error/handle-error";
import { createClient } from "../supabase/server";
import { SendWelcomeEmail } from "@/actions/emails/welcome";

export const VerifyOtp = async (
  type: "signup" | "recovery",
  email: string,
  token: string
): Promise<string | null> => {
  try {
    if (!isCorrectFormat("email", email)) throw new Error("Invalid email");
    const { auth } = await createClient();
    const { data, error } = await auth.verifyOtp({
      type,
      email,
      token,
    });

    if (error || !data) throw error;

    const emailRespose = await SendWelcomeEmail(email, "John Kennedy");
    if (emailRespose) console.error("Welcome Email Send Fail.", emailRespose);

    return null;
  } catch (error) {
    return handleError(error);
  }
};

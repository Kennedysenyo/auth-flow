import { handleError } from "../error/handle-error";
import { createAdminClient } from "../supabase/server";

export const generateOTP = async (
  type: "signup" | "recovery",
  email: string,
  password?: string
): Promise<string | null> => {
  try {
    const { auth } = await createAdminClient();

    if (type === "signup") {
      if (!password)
        throw new Error("Password required for signup token generation");

      const { data, error } = await auth.admin.generateLink({
        type: "signup",
        email,
        password,
      });

      if (error && !data)
        throw new Error(error.message || "OTP generation failed");

      const otp = data.properties?.email_otp;
      console.log("Signup_otp: ", otp);
      // Send otp to emial

      return null;
    }

    const { data, error } = await auth.admin.generateLink({
      type,
      email,
    });
    if (error || !data) throw error;
    const otp = data.properties.email_otp;
    console.log("Recovery otp: ", otp);
    // Forward to email

    return null;
  } catch (error) {
    return handleError(error);
  }
};

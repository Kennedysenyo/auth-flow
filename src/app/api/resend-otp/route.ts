import { redis } from "@/lib/redis/redis";
import { createAdminClient } from "@/lib/supabase/server";
import { isCorrectFormat } from "@/utils/input-format";
import { NextResponse } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";

// Initialize rate limiter
const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(3, "1h"), // 3 attempts per hour
});

export const POST = async (req: Request) => {
  const { email, token, type } = await req.json();
  const { auth } = await createAdminClient();

  // Validate input
  if (!isCorrectFormat("email", email) || !type) {
    return NextResponse.json(
      { error: { message: "Valid email and type are required" } },
      { status: 400 }
    );
  }

  // Rate limiting (uncomment and use your Redis instance)
  // const { success } = await ratelimit.limit(email);
  // if (!success) {
  //   return NextResponse.json(
  //     { error: { message: "Too many requests. Try again later." } },
  //     { status: 429 }
  //   );
  // }

  try {
    if (type === "signup") {
      // Validate signup token
      const tokenData: string | null = await redis.get(`signup_token:${token}`);

      if (!tokenData) {
        return NextResponse.json(
          { error: { message: "Expired or invalid token" } },
          { status: 400 }
        );
      }

      // Parse and verify token data
      let parsedData: { email: string; hashedPassword: string };
      try {
        parsedData =
          typeof tokenData === "object" ? tokenData : JSON.parse(tokenData);

        if (!parsedData?.hashedPassword) {
          throw new Error("Missing hashed password");
        }
      } catch (error) {
        return NextResponse.json(
          { error: { message: "Invalid token data" } },
          { status: 400 }
        );
      }

      // Generate signup link
      const { data: verificationData, error: signupError } =
        await auth.admin.generateLink({
          type: "signup",
          email,
          password: parsedData.hashedPassword,
        });

      if (!verificationData || signupError) {
        return NextResponse.json(
          { error: { message: "Failed to generate signup OTP" } },
          { status: 400 }
        );
      }

      console.log("Signup OTP:", verificationData.properties?.email_otp);
      // TODO: Send email with OTP
    } else {
      // Handle recovery flow
      const { data, error: recoveryError } = await auth.admin.generateLink({
        type: "recovery",
        email,
      });

      if (!data || recoveryError) {
        console.error("Recovery OTP failed:", recoveryError?.message);
        return NextResponse.json(
          { error: { message: "Failed to generate recovery OTP" } },
          { status: 400 }
        );
      }

      console.log("Recovery OTP:", data.properties?.email_otp);
      // TODO: Send email with OTP
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("OTP generation error:", error);
    return NextResponse.json(
      { error: { message: "Internal server error" } },
      { status: 500 }
    );
  }
};

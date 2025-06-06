"use client";

import {
  validateOtpForm,
  VerifyTokeFormState,
} from "@/actions/auth/verify-otp";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState } from "react";
type Props = {
  email: string;
  signUpToken?: string;
};

export const OptForm = ({ email, signUpToken }: Props) => {
  // OTP Resend
  const [isResending, setIsResending] = useState<boolean>(false);
  const [resendError, setResendError] = useState<string | null>(null);
  const type = signUpToken ? "signup" : "recovery";

  const handleResend = async () => {
    try {
      setIsResending(true);
      const res = await fetch("/api/resend-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, token: signUpToken, type }),
      });
      const data = res.json();
      if (!data) throw new Error("Failed to resend OTP");
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
        setResendError(error.message);
      }
      setResendError(error as string);
    } finally {
      setIsResending(false);
    }
  };
  // Form Submission
  const router = useRouter();
  const initialState: VerifyTokeFormState = {
    error: {},
    success: false,
    errorMessage: null,
  };
  const [state, formAction, isPending] = useActionState(
    validateOtpForm.bind(null, { email, type }),
    initialState
  );

  useEffect(() => {
    if (state.success) {
      type === "signup"
        ? router.replace("/")
        : router.push("/set-new-password");
    }
  }, [state, router, type]);

  return (
    <form
      action={formAction}
      className="p-4 border flex flex-col w-md gap-2 rounded-md"
    >
      <h2 className="text-center text-2xl">Verify Code</h2>
      <p className="text-xs text-center">
        Verification code sent to:{" "}
        <span className="text-blue-300">{email}</span>
      </p>
      {state.errorMessage && (
        <p className="text-xs text-red-500 text-center">{state.errorMessage}</p>
      )}
      {resendError && (
        <p className="text-xs text-center text-red-500">{resendError}</p>
      )}
      <div>
        <input
          type="text"
          name="token"
          placeholder="Enter token"
          className="p-2 border rounded-md mb-2 w-full mt-4 text-center"
        />
        {state.error.token && (
          <p className="text-xs text-red-500">{state.error.token}</p>
        )}
      </div>

      <button
        className="bg-gray-300 text-black p-2 rounded-md cursor-pointer"
        type="submit"
      >
        {isPending ? "Verifying..." : " Verify"}
      </button>
      <p className="text-xs text-center">
        Didn't recieve code?{" "}
        <span
          className={`text-blue-300 cursor-pointer underline ${
            isResending && "pointer-events-none"
          }`}
          onClick={handleResend}
        >
          {isResending ? "Resending..." : "Resend"}
        </span>
      </p>
    </form>
  );
};

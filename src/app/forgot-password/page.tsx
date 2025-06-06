"use client";

import {
  ForgotPasswordFormState,
  validateForgotPasswordForm,
} from "@/actions/auth/forgot-password";
import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const initilaState: ForgotPasswordFormState = {
    error: {},
    success: false,
    errorMessage: null,
  };
  const [state, formAction, isPending] = useActionState(
    validateForgotPasswordForm,
    initilaState
  );

  useEffect(() => {
    if (state.success) {
      router.push("/verify-otp");
    }
  }, [state, router]);

  return (
    <div className="mt-20">
      <form
        action={formAction}
        className="p-4 border flex flex-col w-md gap-2 rounded-md"
      >
        <h2 className="text-center text-2xl">Forgot Password?</h2>
        <p className="text-xs text-center">
          Enter your email to recieve an otp code
        </p>
        <div>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            className="p-2 border rounded-md mb-2 w-full mt-4 text-center"
          />
          {state.error.email && (
            <p className="text-xs text-red-500">{state.error.email}</p>
          )}
        </div>
        <button
          className="bg-gray-300 text-black p-2 rounded-md cursor-pointer"
          type="submit"
        >
          {isPending ? "Sending..." : " Send Code"}
        </button>
      </form>
    </div>
  );
}

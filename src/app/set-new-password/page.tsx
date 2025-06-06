"use client";

import {
  NewPaswordFormState,
  validateNewPaswordForm,
} from "@/actions/auth/set-new-password";
import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";

export default function SetNewPasswordPage() {
  const router = useRouter();
  const initilaState: NewPaswordFormState = {
    errors: {},
    success: false,
    errorMessage: null,
  };
  const [state, formAction, isPending] = useActionState(
    validateNewPaswordForm,
    initilaState
  );

  useEffect(() => {
    if (state.success) {
      router.replace("/login");
    }
  }, [state, router]);
  return (
    <div className="mt-20">
      <form
        action={formAction}
        className="flex flex-col gap-2 w-md p-4 border rounded-md"
      >
        <h2 className="text-center text-2xl">Set New Password</h2>
        {state.errorMessage && (
          <p className="text-xs text-red-500 text-center">
            {state.errorMessage}
          </p>
        )}
        <div className="flex flex-col w-full">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            name="password"
            id="password"
            placeholder="Enter your password"
            className="p-2 border rounded-md mb-2"
          />
          {state.errors.password && (
            <p className="text-xs text-red-500">{state.errors.password}</p>
          )}
        </div>

        <div className="flex flex-col w-full">
          <label htmlFor="confirm-password"> Confirm Password:</label>
          <input
            type="password"
            name="confirm-password"
            id="confirm-password"
            placeholder="Confirm password"
            className="p-2 border rounded-md mb-2"
          />
          {state.errors.confirmPassword && (
            <p className="text-xs text-red-500">
              {state.errors.confirmPassword}
            </p>
          )}
        </div>
        <button className="bg-gray-300 p-2 text-black rounded-md cursor-pointer">
          {isPending ? "Saving..." : "Save"}
        </button>
      </form>
    </div>
  );
}

"use client";
import { FormState, submitAction } from "@/actions/auth/login-signup";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";

type Props = {
  type: "login" | "signup";
};

export const AuthForm = ({ type }: Props) => {
  const isLoginPage = type === "login";
  const router = useRouter();

  const initialState: FormState = {
    inputErrors: {},
    success: false,
    errorMessage: null,
  };

  const [state, formAction, isPending] = useActionState(
    submitAction.bind(null, isLoginPage),
    initialState
  );

  useEffect(() => {
    if (state.success) {
      isLoginPage ? router.replace("/") : router.push("/verify-otp");
    }
  }, [state, router, isLoginPage]);

  return (
    <form
      action={formAction}
      className=" border p-4 w-md flex flex-col gap-2 rounded-md"
    >
      <h2 className="text-center text-2xl">
        {isLoginPage ? "Login" : "Sign Up"}
      </h2>
      {state.errorMessage && (
        <p className="text-center text-xs text-red-500">{state.errorMessage}</p>
      )}
      <div className="flex flex-col">
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          name="email"
          id="email"
          placeholder="Enter your email"
          className="p-2 border rounded-md mb-2"
        />
        {state.inputErrors.email && (
          <p className="text-xs text-red-500">{state.inputErrors.email}</p>
        )}
      </div>
      <div className="flex flex-col">
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          name="password"
          id="password"
          placeholder="Enter your password"
          className="p-2 border rounded-md mb-2"
        />
        {state.inputErrors.password && (
          <p className="text-xs text-red-500">{state.inputErrors.password}</p>
        )}
        {isLoginPage && (
          <Link
            className="text-xs text-blue-300 text-end"
            href="/forgot-password"
          >
            Forgot Password?
          </Link>
        )}
      </div>

      {!isLoginPage && (
        <div className="flex flex-col">
          <label htmlFor="confirm_password"> Confirm Password:</label>
          <input
            type="password"
            name="confirm_password"
            id="confirm_password"
            placeholder="Confirm password"
            className="p-2 border rounded-md mb-2"
          />
          {state.inputErrors.confirmPassword && (
            <p className="text-xs text-red-500">
              {state.inputErrors.confirmPassword}
            </p>
          )}
        </div>
      )}
      <button
        className="bg-gray-300 text-black p-2 rounded-md cursor-pointer mt-2"
        type="submit"
        disabled={isPending}
      >
        {isPending ? "..." : isLoginPage ? "Login" : "Sign UP"}
      </button>

      <div className="flex justify-center items-center w-full p-4 flex-col">
        {isLoginPage ? (
          <button className="bg-white text-black px-4 py-2 text-center cursor-pointer">
            Log in with google
          </button>
        ) : (
          <button className="bg-white text-black px-4 py-2 text-center cursor-pointer">
            Signup with google
          </button>
        )}
      </div>

      {
        <p className="text-center text-xs">
          {isLoginPage
            ? "Don't have an account yet?"
            : "Already have an account?"}{" "}
          <Link
            className={`underline ${isPending && "pointer-events-none"}`}
            href={isLoginPage ? "/sign-up" : "/login"}
          >
            {isLoginPage ? "Sign Up" : "Login"}
          </Link>
        </p>
      }
    </form>
  );
};

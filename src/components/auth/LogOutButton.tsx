"use client";

import { logoutAction } from "@/actions/auth/logout";
import { useRouter } from "next/navigation";
import { useState } from "react";

export const LogOutButton = () => {
  const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false);
  const router = useRouter();

  const handleLogout = async () => {
    setIsLoggingOut(true);
    const errorMessage = await logoutAction();
    setIsLoggingOut(false);
    if (!errorMessage) router.replace("/login");
  };
  return (
    <button
      onClick={handleLogout}
      className="bg-gray-300 text-black p-2 rounded-md w-20"
    >
      {isLoggingOut ? "..." : "Logout"}
    </button>
  );
};

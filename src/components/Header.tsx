import Link from "next/link";
import { LogOutButton } from "./auth/LogOutButton";
import { getUser } from "@/lib/supabase/server";
import { User } from "@supabase/supabase-js";

export const Header = async () => {
  const user: User | null = await getUser();
  if (user) console.log("There is a user");

  return (
    <header className="flex justify-end py-4 px-8 items-center border-b shadow">
      <nav className="flex gap-2 items-center">
        {!user ? (
          <div className="flex gap-2 items-center">
            <Link
              className="p-2 bg-gray-300 text-center text-black rounded-md w-20"
              href="/login"
            >
              Login
            </Link>
            <Link
              className="p-2 bg-gray-300 text-center text-black rounded-md w-20"
              href="/sign-up"
            >
              Signup
            </Link>
          </div>
        ) : (
          <LogOutButton />
        )}
      </nav>
    </header>
  );
};

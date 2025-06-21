"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

type Providers = "google" | "apple" | "github";

const signInWith = (provider: Providers) => async () => {
  const { auth } = await createClient();

  const authCallbackUrl = `${process.env.SITE_URL}/api/auth/callback`;

  const { data, error } = await auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: authCallbackUrl,
    },
  });

  if (!data || error) console.error(error);
  console.log(data);
  const { url } = data;
  redirect(url!);
};

export const signInWithGoogle = signInWith("google");

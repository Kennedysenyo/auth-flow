import { createServerClient } from "@supabase/ssr";
import { createClient as createNewClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

// Create user
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {}
        },
      },
    }
  );
}

// fetch user
export const getUser = async () => {
  const { auth } = await createClient();
  const { data, error } = await auth.getUser();
  if (error) return null;
  return data.user;
};

// Admin create user
export const createAdminClient = async () => {
  return createNewClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SRK!);
};

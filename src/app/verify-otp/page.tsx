import { OptForm } from "@/components/auth/OtpForm";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function VerifyOtpPage() {
  const cookieStore = await cookies();
  const email = cookieStore.get("email")?.value;
  const signupToken = cookieStore.get("signup")?.value;

  if (!email) redirect("/login");

  return (
    <div className="mt-20">
      <OptForm email={email} signUpToken={signupToken} />
    </div>
  );
}

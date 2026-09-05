import type { Metadata } from "next";
import { SignInForm } from "@/app/(auth)/sign-in/sign-in-form";

export const metadata: Metadata = {
  title: "Sign in",
};

export default function SignInPage() {
  return (
    <>
      <h1 className="mb-2 text-h1">Sign in</h1>
      <p className="mb-8 text-body text-ink-secondary">
        Use the email on your person record. Sessions are not wired yet.
      </p>
      <SignInForm />
    </>
  );
}

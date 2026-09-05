import type { Metadata } from "next";
import { ForgotPasswordForm } from "@/app/(auth)/forgot-password/forgot-password-form";

export const metadata: Metadata = {
  title: "Reset your password",
};

export default function ForgotPasswordPage() {
  return (
    <>
      <h1 className="mb-2 text-h1">Reset your password</h1>
      <p className="mb-8 text-body text-ink-secondary">
        Enter the email on your person record.
      </p>
      <ForgotPasswordForm />
    </>
  );
}

import { Suspense } from "react";
import LoginForm from "@/ui/features/auth/pages/LoginForm";

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
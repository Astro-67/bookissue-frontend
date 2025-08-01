import { createFileRoute } from "@tanstack/react-router";
import { LoginForm } from "../features/auth/components/LoginForm";

export const Route = createFileRoute("/login")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div >
      <LoginForm />
    </div>
  );
}

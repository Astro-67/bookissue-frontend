import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {
  Outlet,
  createRootRoute,
  useNavigate,
  useRouterState,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { Toaster } from "react-hot-toast";
import { AuthProvider, useAuth } from "../contexts/AuthContext";
import LoadingSpinner from "../ui/LoadingSpinner";
import { SharedLayout } from "../ui/SharedLayout";
import { useEffect } from "react";

function AuthenticatedApp() {
  const router = useRouterState();
  const navigate = useNavigate();
  const pathname = router.location.pathname;
  const { isAuthenticated, isLoading, user } = useAuth();

  // Role-based path authorization
  const isAuthorizedForPath = (userRole: string, currentPath: string): boolean => {
    const pathRole = userRole === "super_admin" ? "super-admin" : userRole;

    if (currentPath.startsWith(`/${pathRole}/`)) return true;

    // Allow access to public auth pages
    if (currentPath === "/login" || currentPath === "/") return true;

    return false;
  };

  // Navigate to correct dashboard
  const redirectToCorrectDashboard = (userRole: string) => {
    const routeRole = userRole === "super_admin" ? "super-admin" : userRole;
    navigate({ to: `/${routeRole}/dashboard` });
  };

  // Redirect if authenticated and on wrong path
  useEffect(() => {
    if (isLoading) return;

    // Handle unauthenticated users - redirect to login
    if (!isAuthenticated) {
      const isAuthPage = pathname === "/login" || pathname === "/";
      if (!isAuthPage) {
        navigate({ to: "/login", replace: true });
      }
      return;
    }

    // Handle authenticated users with user data
    if (isAuthenticated && user) {
      const isAuthPage = pathname === "/login" || pathname === "/";
      
      // Redirect from auth pages to dashboard if already authenticated
      if (isAuthPage) {
        redirectToCorrectDashboard(user.role);
        return;
      }
      
      // Check if user is authorized for current path
      if (!isAuthorizedForPath(user.role, pathname)) {
        redirectToCorrectDashboard(user.role);
        return;
      }
    }
  }, [isAuthenticated, user, pathname, isLoading, navigate]);

  // Wait for auth status to be ready
  if (isLoading) {
    return <LoadingSpinner />;
  }

  const isAuthPage = pathname === "/login" || pathname === "/";

  // If user is authenticated but doesn't have user data yet, wait
  if (isAuthenticated && !user) {
    return <LoadingSpinner />;
  }

  // If authenticated user is on auth page, show loading while redirecting
  if (isAuthenticated && user && isAuthPage) {
    return <LoadingSpinner />;
  }

  // If unauthenticated user is not on auth page, show loading while redirecting
  if (!isAuthenticated && !isAuthPage) {
    return <LoadingSpinner />;
  }

  // Prevent rendering unauthorized paths for authenticated users
  if (isAuthenticated && user && !isAuthPage && !isAuthorizedForPath(user.role, pathname)) {
    return <LoadingSpinner />;
  }

  const role: "student" | "staff" | "ict" | "super_admin" = user?.role || "student";

  return (
    <>
      {(isAuthPage && !isAuthenticated) ? (
        // Only show auth pages for unauthenticated users
        <Outlet />
      ) : !isAuthPage && isAuthenticated && user ? (
        // Show dashboard layout for authenticated users on dashboard pages
        <SharedLayout role={role}>
          <Outlet />
        </SharedLayout>
      ) : (
        // Show loading for any other state
        <LoadingSpinner />
      )}

      <Toaster
        position="top-center"
        gutter={12}
        containerStyle={{ margin: "8px" }}
        toastOptions={{
          success: { duration: 3000 },
          error: { duration: 5000 },
          style: {
            fontSize: "16px",
            backgroundColor: "#ffffff",
            color: "#374151",
            padding: "16px 22px",
          },
        }}
      />

      <ReactQueryDevtools initialIsOpen={false} />
      <TanStackRouterDevtools />
    </>
  );
}

function RootComponent() {
  return (
    <AuthProvider>
      <AuthenticatedApp />
    </AuthProvider>
  );
}

export const Route = createRootRoute({
  component: RootComponent,
});

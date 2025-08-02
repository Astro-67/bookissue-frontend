import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {
  Outlet,
  createRootRoute,
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
  const pathname = router.location.pathname;
  const { isAuthenticated, isLoading, user } = useAuth();

  // Role validation function
  const isAuthorizedForPath = (userRole: string, currentPath: string): boolean => {
    // Convert super_admin to super-admin for path checking
    const pathRole = userRole === "super_admin" ? "super-admin" : userRole;
    
    // Check if the current path matches the user's role
    if (currentPath.startsWith(`/${pathRole}/`)) {
      return true;
    }
    
    // Allow access to auth pages
    if (currentPath === "/login" || currentPath === "/") {
      return true;
    }
    
    return false;
  };

  // Redirect to correct dashboard based on user role
  const redirectToCorrectDashboard = (userRole: string) => {
    const routeRole = userRole === "super_admin" ? "super-admin" : userRole;
    window.location.href = `/${routeRole}/dashboard`;
  };

  // Security check: Handle unauthorized access with useEffect to prevent loops
  useEffect(() => {
    if (isAuthenticated && user && !isLoading) {
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
  }, [isAuthenticated, user, pathname, isLoading]);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return <LoadingSpinner />;
  }

  // Determine if we should show the layout
  const isAuthPage = pathname === "/login" || pathname === "/";

  // If user is not authenticated and not on auth page, redirect to login
  if (!isAuthenticated && !isAuthPage) {
    window.location.href = "/login";
    return <LoadingSpinner />;
  }

  // If no user data yet but authenticated, show loading
  if (isAuthenticated && !user) {
    return <LoadingSpinner />;
  }

  // If user is trying to access unauthorized path, show loading while redirecting
  if (isAuthenticated && user && !isAuthPage && !isAuthorizedForPath(user.role, pathname)) {
    return <LoadingSpinner />;
  }

  // Determine the role based on the user's actual role (not path)
  const role: "student" | "staff" | "ict" | "super_admin" = user?.role || "student";

  return (
    <>
      {pathname === "/login" || pathname === "/" ? (
        // No layout for auth pages
        <Outlet />
      ) : (
        // Show layout for dashboard pages
        <SharedLayout role={role}>
          <Outlet />
        </SharedLayout>
      )}
      <Toaster
        position="top-center"
        gutter={12}
        containerStyle={{ margin: "8px" }}
        toastOptions={{
          success: {
            duration: 3000,
          },
          error: {
            duration: 5000,
          },
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

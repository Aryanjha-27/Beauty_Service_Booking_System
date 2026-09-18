import { AuthProvider } from "@/context/AuthContext";

/**
 * App Providers Component
 * Wraps global context providers (AuthContext)
 * Simple and clean for 4th Sem BCA Student
 */
export function Providers({ children }) {
  return <AuthProvider>{children}</AuthProvider>;
}

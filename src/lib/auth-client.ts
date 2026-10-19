import { createAuthClient } from "better-auth/react";
import { getBaseUrl } from "@/lib/env";

export const authClient = createAuthClient({
  baseURL: getBaseUrl(),
});

export const {
  signIn,
  signUp,
  signOut,
  useSession,
  getSession,
} = authClient;

/**
 * Build login URL that returns the user to `returnTo` after sign-in.
 * Use for public pages where actions require authentication.
 */
export function loginWithCallback(returnTo: string): string {
  return `/login?callbackUrl=${encodeURIComponent(returnTo)}`
}

import type { ReactNode } from "react"

/**
 * @deprecated Admin chrome is provided by `app/admin/layout.tsx` (`AdminShell`).
 * This component is a no-op passthrough for any legacy imports.
 */
export function AdminSidebar({ children }: { children: ReactNode }) {
  return <>{children}</>
}

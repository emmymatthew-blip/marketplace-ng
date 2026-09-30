import { AdminLayoutClient } from "@/components/admin/admin-layout-client"

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <AdminLayoutClient>{children}</AdminLayoutClient>
}

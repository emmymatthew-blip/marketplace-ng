import { redirect } from "next/navigation"

import { WEEKLY_DEMO_APPLICATION_HREF } from "@/lib/demo-routes"

/**
 * Legacy URL — curated weekly programme only. All hosts must apply first.
 */
export default function DemonstrationsNewRedirectPage() {
  redirect(WEEKLY_DEMO_APPLICATION_HREF)
}

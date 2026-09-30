import { cn } from "@/lib/utils"

const SECTION_GAP = "space-y-6"

/** Page content wrapper. Horizontal padding is controlled by DashboardShell only. */
export function DashboardPageContainer({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn("w-full", SECTION_GAP, className)}>
      {children}
    </div>
  )
}

export const dashboardSpacing = {
  sectionGap: SECTION_GAP,
} as const

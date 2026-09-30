"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { useSession } from "next-auth/react"
import { isSeller } from "@/lib/user-roles"

type DashboardMode = "buyer" | "seller"

interface DashboardModeContextType {
  mode: DashboardMode
  setMode: (mode: DashboardMode) => void
  canSwitchToSeller: boolean
  canSwitchToBuyer: boolean
  isSellerMode: boolean
  isBuyerMode: boolean
}

const DashboardModeContext = createContext<DashboardModeContextType | undefined>(undefined)

export function DashboardModeProvider({ children }: { children: ReactNode }) {
  const { data: session } = useSession()
  const userRole = session?.user?.role || ""
  const userIsSeller = isSeller(userRole)
  
  // Determine initial mode based on user role
  const [mode, setModeState] = useState<DashboardMode>(() => {
    if (typeof window !== "undefined") {
      const savedMode = localStorage.getItem("dashboardMode") as DashboardMode | null
      if (savedMode && ((savedMode === "seller" && userIsSeller) || savedMode === "buyer")) {
        return savedMode
      }
    }
    // Default: sellers start in seller mode, buyers in buyer mode
    return userIsSeller ? "seller" : "buyer"
  })

  // Save mode to localStorage and cookie when it changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("dashboardMode", mode)
      // Also set cookie for server-side access
      document.cookie = `dashboardMode=${mode}; path=/; max-age=31536000; SameSite=Lax`
    }
  }, [mode])

  // Update mode if user role changes
  useEffect(() => {
    if (userIsSeller && mode === "buyer") {
      // User can switch to seller mode
    } else if (!userIsSeller && mode === "seller") {
      // User is a buyer, force buyer mode
      setModeState("buyer")
    }
  }, [userIsSeller, mode])

  const setMode = (newMode: DashboardMode) => {
    // Validate mode switch
    if (newMode === "seller" && !userIsSeller) {
      console.warn("Cannot switch to seller mode: User is not a seller")
      return
    }
    setModeState(newMode)
  }

  const canSwitchToSeller = userIsSeller
  const canSwitchToBuyer = true // Anyone can be a buyer

  return (
    <DashboardModeContext.Provider
      value={{
        mode,
        setMode,
        canSwitchToSeller,
        canSwitchToBuyer,
        isSellerMode: mode === "seller",
        isBuyerMode: mode === "buyer",
      }}
    >
      {children}
    </DashboardModeContext.Provider>
  )
}

export function useDashboardMode() {
  const context = useContext(DashboardModeContext)
  if (context === undefined) {
    throw new Error("useDashboardMode must be used within a DashboardModeProvider")
  }
  return context
}

"use client"

import { useDashboardMode } from "@/hooks/use-dashboard-mode"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Store, AlertCircle } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useState } from "react"
import { BecomeSellerForm } from "@/components/dashboard/become-seller-form"

export function ModeSwitcher() {
  const { mode, setMode, canSwitchToSeller, isSellerMode, isBuyerMode } = useDashboardMode()
  const [showOptInDialog, setShowOptInDialog] = useState(false)

  const handleSwitchToSeller = () => {
    if (canSwitchToSeller) {
      setMode("seller")
    } else {
      setShowOptInDialog(true)
    }
  }

  const handleOptIn = () => {
    setShowOptInDialog(true)
  }

  return (
    <>
      <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg border">
        <div className="flex items-center gap-2 flex-1">
          {isBuyerMode ? (
            <ShoppingCart className="h-4 w-4 text-blue-600" />
          ) : (
            <Store className="h-4 w-4 text-green-600" />
          )}
          <span className="text-sm font-medium">
            {isBuyerMode ? "Buyer Mode" : "Seller Mode"}
          </span>
          <Badge variant={isBuyerMode ? "default" : "secondary"} className="text-xs">
            {isBuyerMode ? "Shopping" : "Selling"}
          </Badge>
        </div>
        
        <div className="flex items-center gap-1">
          {isBuyerMode ? (
            <Button
              variant="outline"
              size="sm"
              onClick={handleSwitchToSeller}
              className="h-8 text-xs"
            >
              <Store className="h-3 w-3 mr-1" />
              Switch to Seller
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setMode("buyer")}
              className="h-8 text-xs"
            >
              <ShoppingCart className="h-3 w-3 mr-1" />
              Switch to Buyer
            </Button>
          )}
        </div>
      </div>

      <Dialog open={showOptInDialog} onOpenChange={setShowOptInDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Become a Seller</DialogTitle>
            <DialogDescription>
              Opt in as a seller to unlock all seller features
            </DialogDescription>
          </DialogHeader>
          <BecomeSellerForm />
        </DialogContent>
      </Dialog>
    </>
  )
}

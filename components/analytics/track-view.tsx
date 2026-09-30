"use client"

import { useEffect, useRef } from "react"

type ViewEventType = "product_detail_view" | "vendor_profile_view" | "demo_view"

interface TrackViewProps {
  eventType: ViewEventType
  productId?: string
  vendorId?: string
  demoId?: string
}

export function TrackView({ eventType, productId, vendorId, demoId }: TrackViewProps) {
  const sent = useRef(false)

  useEffect(() => {
    if (sent.current) return
    const payload: Record<string, string> = { eventType }
    if (productId) payload.productId = productId
    if (vendorId) payload.vendorId = vendorId
    if (demoId) payload.demoId = demoId
    if (!productId && !vendorId && !demoId) return
    sent.current = true
    fetch("/api/analytics/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).catch(() => {})
  }, [eventType, productId, vendorId, demoId])

  return null
}

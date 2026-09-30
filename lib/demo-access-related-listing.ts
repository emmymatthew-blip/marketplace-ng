/**
 * DemoAccessRequest.applicationPayload can arrive from node-pg as a string, or (in some setups)
 * as an already-parsed object. Column names may vary in casing.
 */

export function getApplicationPayloadRaw(row: Record<string, unknown>): unknown {
  return row.applicationPayload ?? row.applicationpayload ?? row["applicationPayload"]
}

export function parseApplicationPayloadObject(raw: unknown): Record<string, unknown> | null {
  if (raw == null) return null
  if (typeof Buffer !== "undefined" && Buffer.isBuffer(raw)) {
    raw = raw.toString("utf8")
  }
  if (typeof raw === "object" && raw !== null && !Array.isArray(raw)) {
    return raw as Record<string, unknown>
  }
  if (typeof raw !== "string") return null
  const s = raw.trim()
  if (!s) return null
  try {
    let v: unknown = JSON.parse(s)
    if (typeof v === "string" && v.trim().startsWith("{")) {
      try {
        v = JSON.parse(v)
      } catch {
        /* keep string v */
      }
    }
    if (v && typeof v === "object" && !Array.isArray(v)) return v as Record<string, unknown>
  } catch {
    return null
  }
  return null
}

export function extractRelatedListingId(payload: Record<string, unknown> | null): string {
  if (!payload) return ""
  const v = payload.relatedListingId ?? payload.related_listing_id
  if (typeof v === "string") return v.trim()
  if (v != null && (typeof v === "number" || typeof v === "boolean")) return String(v).trim()
  return ""
}

export function indexProductTitlesById(
  rows: Array<Record<string, unknown>>
): Record<string, string> {
  const titleById: Record<string, string> = {}
  for (const row of rows) {
    const id = row.id != null ? String(row.id).trim() : ""
    const title = row.title
    if (id && title != null && String(title).trim() !== "") {
      titleById[id] = String(title).trim()
    }
  }
  return titleById
}

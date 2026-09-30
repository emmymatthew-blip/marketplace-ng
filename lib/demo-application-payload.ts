import { z } from "zod"

/** Structured payload stored on DemoAccessRequest.applicationPayload (JSON string) */
export const demoApplicationPayloadSchema = z.object({
  summary: z.string().min(20, "Short summary must be at least 20 characters").max(600),
  category: z.string().min(1, "Category is required"),
  /** Curated programme: live sessions only */
  format: z.literal("LIVE"),
  preferredWeekNote: z.string().min(5, "Describe your preferred week or slot"),
  alternativeWeekNote: z.string().optional(),
  schedulingFlexibility: z.enum(["fixed_week", "flexible_next"]),
  relatedListingId: z.string().optional(),
  productCategory: z.string().min(1, "Product category is required"),
  productOrServiceDescription: z.string().min(20, "Describe what is being demonstrated"),
  tiedToExistingListing: z.boolean(),
  attendeesWillLearn: z.string().min(20),
  targetAudience: z.string().min(10),
  keyBenefits: z.string().min(20),
  approvalReason: z.string().min(40, "Please explain why this should be approved or featured"),
  coverImageUrl: z
    .string()
    .optional()
    .refine((s) => !s || /^https?:\/\/.+/i.test(s), "Cover image must be a valid http(s) URL"),
  previewImageUrls: z.array(z.string()).max(6).default([]),
  previewVideoUrl: z
    .string()
    .optional()
    .refine((s) => !s || /^https?:\/\/.+/i.test(s), "Preview video must be a valid http(s) URL"),
  hostingPlatform: z.enum(["zoom", "google_meet", "youtube_live", "other"]),
  hostingPlatformOther: z.string().optional(),
  estimatedDurationMinutes: z.number().min(15).max(480),
  maxAttendees: z.number().min(1).max(10000),
  registrationRequired: z.boolean(),
  approvalRequiredToJoin: z.boolean(),
  companyName: z.string().min(2),
  contactPerson: z.string().min(2),
  contactRole: z.string().min(2),
  corporateEmail: z.string().email(),
  companyWebsite: z
    .string()
    .optional()
    .refine((s) => !s || /^https?:\/\/.+/i.test(s), "Company website must be a valid http(s) URL"),
  confirmAvailability: z.boolean().refine((v) => v === true, {
    message: "Please confirm availability for your selected week",
  }),
  confirmOriginalContent: z.boolean().refine((v) => v === true, {
    message: "Please confirm content is original or authorized",
  }),
  confirmApprovalRequired: z.boolean().refine((v) => v === true, {
    message: "Please confirm you understand public scheduling requires approval",
  }),
})
  .superRefine((data, ctx) => {
    if (data.hostingPlatform === "other") {
      const o = (data.hostingPlatformOther || "").trim()
      if (o.length < 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Please name the hosting platform",
          path: ["hostingPlatformOther"],
        })
      }
    }
  })

export type DemoApplicationPayload = z.infer<typeof demoApplicationPayloadSchema>

/** Parse and validate client JSON; returns normalized payload + JSON string for DB */
function normalizeApplicationPayload(raw: unknown): unknown {
  if (typeof raw !== "object" || raw === null) return raw
  const o = { ...(raw as Record<string, unknown>) }
  for (const key of [
    "coverImageUrl",
    "previewVideoUrl",
    "companyWebsite",
    "alternativeWeekNote",
    "relatedListingId",
    "hostingPlatformOther",
  ]) {
    if (o[key] === "") delete o[key]
  }
  return o
}

export function parseDemoApplicationPayload(
  raw: unknown
): { ok: true; payload: DemoApplicationPayload; json: string } | { ok: false; error: string } {
  const parsed = demoApplicationPayloadSchema.safeParse(normalizeApplicationPayload(raw))
  if (!parsed.success) {
    const first = parsed.error.flatten().fieldErrors
    const msg = Object.entries(first)
      .map(([k, v]) => `${k}: ${(v as string[]).join(", ")}`)
      .join("; ")
    return { ok: false, error: msg || parsed.error.message }
  }
  return { ok: true, payload: parsed.data, json: JSON.stringify(parsed.data) }
}

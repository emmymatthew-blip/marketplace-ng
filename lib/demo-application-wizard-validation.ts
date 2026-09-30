import type { DemoApplicationPayload } from "@/lib/demo-application-payload"

/** Per-step validation for the demonstration application wizard (not full Zod — final submit uses full schema). */

export function validateStep1(data: {
  title: string
  summary: string
  fullDescription: string
  category: string
}): Record<string, string> {
  const e: Record<string, string> = {}
  if (data.title.trim().length < 10) e.title = "Title must be at least 10 characters"
  if (data.summary.trim().length < 20) e.summary = "Short summary must be at least 20 characters"
  if (data.fullDescription.trim().length < 50) e.fullDescription = "Full description must be at least 50 characters"
  if (!data.category.trim()) e.category = "Select a category"
  return e
}

export function validateStep2(data: {
  productCategory: string
  productOrServiceDescription: string
  whatWillBeDemonstrated: string
}): Record<string, string> {
  const e: Record<string, string> = {}
  if (!data.productCategory.trim()) e.productCategory = "Select a product category"
  const a = data.productOrServiceDescription.trim()
  const b = data.whatWillBeDemonstrated.trim()
  if (a.length < 10) e.productOrServiceDescription = "Describe the product or service (at least 10 characters)"
  if (b.length < 10) e.whatWillBeDemonstrated = "Describe what will be demonstrated (at least 10 characters)"
  const combined = `${a}\n\nWhat will be demonstrated:\n${b}`
  if (combined.length < 20) e.productOrServiceDescription = "Combined context must be at least 20 characters"
  return e
}

export function validateStep3(data: { preferredWeekNote: string }): Record<string, string> {
  const e: Record<string, string> = {}
  if (data.preferredWeekNote.trim().length < 5) {
    e.preferredWeekNote = "Describe your preferred week or slot (at least 5 characters)"
  }
  return e
}

export function validateStep4(data: {
  attendeesWillLearn: string
  targetAudience: string
  keyBenefits: string
  approvalReason: string
}): Record<string, string> {
  const e: Record<string, string> = {}
  if (data.attendeesWillLearn.trim().length < 20) e.attendeesWillLearn = "At least 20 characters"
  if (data.targetAudience.trim().length < 10) e.targetAudience = "At least 10 characters"
  if (data.keyBenefits.trim().length < 20) e.keyBenefits = "At least 20 characters"
  if (data.approvalReason.trim().length < 40) e.approvalReason = "At least 40 characters — explain curation fit"
  return e
}

export function validateStep5(data: {
  p: Partial<DemoApplicationPayload>
  coverImageUrl?: string
  previewVideoUrl?: string
}): Record<string, string> {
  const e: Record<string, string> = {}
  const { p } = data
  const cover = (data.coverImageUrl ?? p.coverImageUrl ?? "").trim()
  if (cover && !/^https?:\/\/.+/i.test(cover)) e.coverImageUrl = "Must be a valid http(s) URL"
  const vid = (data.previewVideoUrl ?? p.previewVideoUrl ?? "").trim()
  if (vid && !/^https?:\/\/.+/i.test(vid)) e.previewVideoUrl = "Must be a valid http(s) URL"
  const web = (p.companyWebsite || "").trim()
  if (web && !/^https?:\/\/.+/i.test(web)) e.companyWebsite = "Must be a valid http(s) URL"

  if (!p.companyName?.trim() || p.companyName.trim().length < 2) e.companyName = "Company name is required"
  if (!p.contactPerson?.trim() || p.contactPerson.trim().length < 2) e.contactPerson = "Contact person is required"
  if (!p.contactRole?.trim() || p.contactRole.trim().length < 2) e.contactRole = "Role / title is required"
  if (!p.corporateEmail?.trim()) e.corporateEmail = "Corporate email is required"
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p.corporateEmail.trim())) e.corporateEmail = "Valid email required"

  if (p.hostingPlatform === "other") {
    const o = (p.hostingPlatformOther || "").trim()
    if (o.length < 2) e.hostingPlatformOther = "Name the platform"
  }

  const dur = p.estimatedDurationMinutes
  if (dur == null || dur < 15 || dur > 480) e.estimatedDurationMinutes = "Duration must be 15–480 minutes"
  const max = p.maxAttendees
  if (max == null || max < 1 || max > 10000) e.maxAttendees = "Enter a valid capacity"

  if (!p.confirmAvailability) e.confirmAvailability = "Required"
  if (!p.confirmOriginalContent) e.confirmOriginalContent = "Required"
  if (!p.confirmApprovalRequired) e.confirmApprovalRequired = "Required"

  return e
}

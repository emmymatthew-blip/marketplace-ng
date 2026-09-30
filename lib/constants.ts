/** Default image placeholder when product/vendor image is missing */
export const PLACEHOLDER_IMAGE = "/placeholder.svg"

/** Strip HTML tags for plain-text meta description */
export function stripHtml(html: string | null | undefined): string {
  if (html == null) return ""
  return String(html).replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").trim()
}

/**
 * Step titles & blurbs — keep in sync with `components/demo-access/demonstration-application-form.tsx`
 */
export const DEMO_APPLICATION_WIZARD_STEPS = [
  {
    id: "1",
    title: "Demonstration basics",
    description: "Title, category, format, and descriptions for reviewers.",
  },
  {
    id: "2",
    title: "Showcase context",
    description: "Link to your marketplace presence and clarify what you’re showcasing.",
  },
  {
    id: "3",
    title: "Scheduling",
    description: "When you’d like to run — and how flexible you are.",
  },
  {
    id: "4",
    title: "Value & audience",
    description: "Audience value and why this belongs in the programme.",
  },
  {
    id: "5",
    title: "Media & confirmation",
    description: "Production preferences, contact, legal confirmations — then submit.",
  },
] as const

const PRODUCT_SPLIT = "\n\nWhat will be demonstrated:\n"

/** Split stored `productOrServiceDescription` back into wizard’s two text areas. */
export function splitProductOrServiceDescription(combined: string): {
  productService: string
  whatWillBeDemonstrated: string
} {
  const idx = combined.indexOf(PRODUCT_SPLIT)
  if (idx === -1) {
    return { productService: combined.trim(), whatWillBeDemonstrated: "" }
  }
  return {
    productService: combined.slice(0, idx).trim(),
    whatWillBeDemonstrated: combined.slice(idx + PRODUCT_SPLIT.length).trim(),
  }
}

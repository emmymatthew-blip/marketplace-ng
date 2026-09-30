"use client"

import { useState, useEffect } from "react"
import DOMPurify from "dompurify"
import { cn } from "@/lib/utils"

const PROSE_CLASSES =
  "prose max-w-none prose-headings:font-semibold prose-p:text-gray-600 prose-ul:text-gray-600 prose-ol:text-gray-600 prose-li:my-1 prose-sm [&_p]:my-1 [&_ul]:my-1 [&_ol]:my-1 [&_li]:my-0.5 [&_h2]:mt-2 [&_h2]:mb-1 [&_h2]:text-sm [&_h2]:font-semibold [&_h3]:mt-1.5 [&_h3]:mb-1 [&_blockquote]:my-1"

interface RichTextProps {
  html?: string | null
  className?: string
}

/** Sanitize and render HTML safely. Handles undefined/empty. Runs sanitization on client to avoid SSR/DOM issues. */
export function RichText({ html, className }: RichTextProps) {
  const [sanitized, setSanitized] = useState("")

  useEffect(() => {
    if (html == null || String(html).trim() === "") {
      setSanitized("")
      return
    }
    setSanitized(
      DOMPurify.sanitize(html, {
        ALLOWED_TAGS: [
          "p", "br", "strong", "em", "u", "s", "a", "ul", "ol", "li",
          "h1", "h2", "h3", "h4", "h5", "h6", "blockquote", "span", "div"
        ],
        ALLOWED_ATTR: ["href", "target", "rel", "class"],
      })
    )
  }, [html])

  if (!sanitized) return null

  return (
    <div
      className={cn(PROSE_CLASSES, className)}
      dangerouslySetInnerHTML={{ __html: sanitized }}
    />
  )
}

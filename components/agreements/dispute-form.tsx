"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { Upload, X, FileText } from "lucide-react"

const disputeFormSchema = z.object({
  reason: z.string({
    required_error: "Please select a reason for the dispute",
  }),
  description: z
    .string()
    .min(20, { message: "Description must be at least 20 characters" })
    .max(1000, { message: "Description must not be longer than 1000 characters" }),
  proposedResolution: z
    .string()
    .min(20, { message: "Proposed resolution must be at least 20 characters" })
    .max(500, { message: "Proposed resolution must not be longer than 500 characters" }),
})

type DisputeFormValues = z.infer<typeof disputeFormSchema>

const ACCEPTED_EVIDENCE_TYPES = "image/*,video/*,.pdf,application/pdf"
const MAX_EVIDENCE_FILES = 5
const MAX_FILE_SIZE_MB = 10

async function uploadEvidenceFile(file: File): Promise<string> {
  const formData = new FormData()
  formData.set("file", file)
  formData.set("folder", "/printmarket/disputes/")
  const res = await fetch("/api/upload/cloudinary", {
    method: "POST",
    body: formData,
  })
  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new Error((data as { error?: string }).error ?? "Upload failed")
  }
  const data = await res.json()
  if (!data.url) throw new Error("No URL returned")
  return data.url
}

export function DisputeForm({ agreementId }: { agreementId: string }) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [evidenceFiles, setEvidenceFiles] = useState<File[]>([])
  const [uploadProgress, setUploadProgress] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const form = useForm<DisputeFormValues>({
    resolver: zodResolver(disputeFormSchema),
    defaultValues: {
      reason: "",
      description: "",
      proposedResolution: "",
    },
  })

  const handleEvidenceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files?.length) return
    const list = Array.from(files)
    const allowed = list.filter((f) => {
      const ok =
        f.type.startsWith("image/") ||
        f.type.startsWith("video/") ||
        f.type === "application/pdf"
      if (!ok) return false
      if (f.size > MAX_FILE_SIZE_MB * 1024 * 1024) return false
      return true
    })
    setEvidenceFiles((prev) => {
      const next = [...prev, ...allowed].slice(0, MAX_EVIDENCE_FILES)
      return next
    })
    e.target.value = ""
  }

  const removeEvidenceFile = (index: number) => {
    setEvidenceFiles((prev) => prev.filter((_, i) => i !== index))
  }

  async function onSubmit(data: DisputeFormValues) {
    setIsSubmitting(true)
    setUploadProgress("Uploading evidence…")
    let evidenceUrls: string[] = []

    try {
      if (evidenceFiles.length > 0) {
        for (const file of evidenceFiles) {
          const url = await uploadEvidenceFile(file)
          evidenceUrls.push(url)
        }
      }
      setUploadProgress("Submitting dispute…")

      const response = await fetch(`/api/agreements/${agreementId}/dispute`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reason: data.reason,
          description: data.description,
          proposedResolution: data.proposedResolution,
          evidence:
            evidenceUrls.length > 0 ? JSON.stringify(evidenceUrls) : undefined,
        }),
      })

      if (!response.ok) {
        const err = await response.json().catch(() => ({}))
        throw new Error((err as { error?: string }).error ?? "Failed to submit dispute")
      }

      toast({
        title: "Dispute submitted",
        description: "Your dispute has been submitted successfully.",
      })

      router.push(`/agreements/${agreementId}`)
    } catch (e) {
      const message = e instanceof Error ? e.message : "Failed to submit dispute. Please try again."
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
      setUploadProgress(null)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="reason"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Reason for Dispute</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a reason" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="breach_of_contract">Breach of Contract</SelectItem>
                  <SelectItem value="quality_issues">Quality Issues</SelectItem>
                  <SelectItem value="delivery_delay">Delivery Delay</SelectItem>
                  <SelectItem value="payment_issues">Payment Issues</SelectItem>
                  <SelectItem value="communication_problems">Communication Problems</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>Select the primary reason for filing this dispute</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description of Issue</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Provide a detailed description of the issue..."
                  className="min-h-[120px]"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Describe the issue in detail, including dates, specific incidents, and how it
                affects the agreement
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-2">
          <FormLabel>Evidence (optional)</FormLabel>
          <FormDescription>
            Upload images, videos, or PDFs to support your dispute (max {MAX_EVIDENCE_FILES}{" "}
            files, {MAX_FILE_SIZE_MB}MB each)
          </FormDescription>
          <input
            ref={fileInputRef}
            type="file"
            accept={ACCEPTED_EVIDENCE_TYPES}
            multiple
            className="hidden"
            onChange={handleEvidenceChange}
          />
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={evidenceFiles.length >= MAX_EVIDENCE_FILES || isSubmitting}
            >
              <Upload className="mr-2 h-4 w-4" />
              Add file
            </Button>
            {evidenceFiles.map((file, index) => (
              <div
                key={index}
                className="flex items-center gap-2 rounded-md border bg-muted/50 px-3 py-2 text-sm"
              >
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span className="truncate max-w-[160px]" title={file.name}>
                  {file.name}
                </span>
                <button
                  type="button"
                  aria-label={`Remove ${file.name}`}
                  className="text-muted-foreground hover:text-foreground"
                  onClick={() => removeEvidenceFile(index)}
                  disabled={isSubmitting}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <FormField
          control={form.control}
          name="proposedResolution"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Proposed Resolution</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="What would you consider a fair resolution to this dispute?"
                  className="min-h-[80px]"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Describe what you believe would be a fair resolution to this dispute
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {uploadProgress && (
          <p className="text-sm text-muted-foreground">{uploadProgress}</p>
        )}

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Submitting…" : "Submit Dispute"}
        </Button>
      </form>
    </Form>
  )
}

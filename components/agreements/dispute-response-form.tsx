"use client"

import { useState, useRef } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { Upload, X, FileText } from "lucide-react"

const schema = z.object({
  message: z.string().min(1, "Message is required").max(2000),
  proposedResolution: z.string().max(500).optional(),
})

type FormValues = z.infer<typeof schema>

const ACCEPTED_EVIDENCE_TYPES = "image/*,video/*,.pdf,application/pdf"
const MAX_EVIDENCE_FILES = 5
const MAX_FILE_SIZE_MB = 10

async function uploadEvidenceFile(file: File): Promise<string> {
  const formData = new FormData()
  formData.set("file", file)
  formData.set("folder", "/printmarket/disputes/")
  const res = await fetch("/api/upload/cloudinary", { method: "POST", body: formData })
  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new Error((data as { error?: string }).error ?? "Upload failed")
  }
  const data = await res.json()
  if (!data.url) throw new Error("No URL returned")
  return data.url
}

interface DisputeResponseFormProps {
  agreementId: string
  onSuccess?: () => void
}

export function DisputeResponseForm({ agreementId, onSuccess }: DisputeResponseFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [evidenceFiles, setEvidenceFiles] = useState<File[]>([])
  const [uploadProgress, setUploadProgress] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { message: "", proposedResolution: "" },
  })

  const handleEvidenceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files?.length) return
    const list = Array.from(files).filter((f) => {
      const ok = f.type.startsWith("image/") || f.type.startsWith("video/") || f.type === "application/pdf"
      return ok && f.size <= MAX_FILE_SIZE_MB * 1024 * 1024
    })
    setEvidenceFiles((prev) => [...prev, ...list].slice(0, MAX_EVIDENCE_FILES))
    e.target.value = ""
  }

  async function onSubmit(data: FormValues) {
    setIsSubmitting(true)
    setUploadProgress("Uploading evidence…")
    let evidenceUrls: string[] = []
    try {
      for (const file of evidenceFiles) {
        const url = await uploadEvidenceFile(file)
        evidenceUrls.push(url)
      }
      setUploadProgress("Submitting response…")
      const res = await fetch(`/api/agreements/${agreementId}/dispute/respond`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: data.message,
          evidence: evidenceUrls.length ? JSON.stringify(evidenceUrls) : undefined,
          proposedResolution: data.proposedResolution || undefined,
        }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error((err as { error?: string }).error ?? "Failed to submit response")
      }
      toast({ title: "Response submitted", description: "Your response has been added to the dispute." })
      form.reset()
      setEvidenceFiles([])
      onSuccess?.()
    } catch (e) {
      toast({
        title: "Error",
        description: e instanceof Error ? e.message : "Failed to submit response.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
      setUploadProgress(null)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Your response</FormLabel>
              <FormControl>
                <Textarea placeholder="Type your response..." className="min-h-[100px]" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="proposedResolution"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Proposed resolution (optional)</FormLabel>
              <FormControl>
                <Textarea placeholder="Suggest a fair resolution..." className="min-h-[80px]" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="space-y-2">
          <FormLabel>Evidence (optional)</FormLabel>
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
              <div key={index} className="flex items-center gap-2 rounded-md border bg-muted/50 px-3 py-2 text-sm">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span className="truncate max-w-[160px]" title={file.name}>{file.name}</span>
                <button
                  type="button"
                  aria-label={`Remove ${file.name}`}
                  className="text-muted-foreground hover:text-foreground"
                  onClick={() => setEvidenceFiles((p) => p.filter((_, i) => i !== index))}
                  disabled={isSubmitting}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
        {uploadProgress && <p className="text-sm text-muted-foreground">{uploadProgress}</p>}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Submitting…" : "Submit response"}
        </Button>
      </form>
    </Form>
  )
}

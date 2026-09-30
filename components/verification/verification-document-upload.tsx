"use client"

import * as React from "react"
import { useDropzone } from "react-dropzone"
import { Upload, File, X, Image, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export interface VerificationDocumentUploadProps {
  value?: File | null
  onChange?: (file: File | null) => void
  accept?: Record<string, string[]>
  maxSize?: number
  disabled?: boolean
  className?: string
}

const DEFAULT_ACCEPT = {
  "image/*": [".png", ".jpg", ".jpeg", ".gif"],
  "application/pdf": [".pdf"],
}

export function VerificationDocumentUpload({
  value,
  onChange,
  accept = DEFAULT_ACCEPT,
  maxSize = 5 * 1024 * 1024,
  disabled,
  className,
}: VerificationDocumentUploadProps) {
  const [progress, setProgress] = React.useState(0)
  const [error, setError] = React.useState<string | null>(null)

  const onDrop = React.useCallback(
    (acceptedFiles: File[], rejectedFiles: { errors: { message: string }[] }[]) => {
      setError(null)
      if (rejectedFiles.length > 0) {
        const msg = rejectedFiles[0].errors[0]?.message ?? "Invalid file"
        setError(msg)
        return
      }
      const file = acceptedFiles[0]
      if (file) {
        setProgress(100)
        onChange?.(file)
      }
    },
    [onChange]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxSize,
    maxFiles: 1,
    disabled,
    onDropRejected: (rejected) => {
      if (rejected[0]?.errors[0]) setError(rejected[0].errors[0].message)
    },
  })

  const removeFile = () => {
    setProgress(0)
    setError(null)
    onChange?.(null)
  }

  const isImage = value?.type.startsWith("image/")
  const isPdf = value?.type === "application/pdf"

  return (
    <div className={cn("space-y-2", className)}>
      {!value ? (
        <div
          {...getRootProps()}
          className={cn(
            "rounded-xl border-2 border-dashed p-6 text-center transition-colors cursor-pointer",
            isDragActive && "border-primary bg-primary/5",
            !isDragActive && "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/30",
            disabled && "pointer-events-none opacity-60"
          )}
        >
          <input {...getInputProps()} />
          <Upload className="mx-auto h-10 w-10 text-muted-foreground" aria-hidden />
          <p className="mt-2 text-sm font-medium text-foreground">Drag and drop your document here</p>
          <p className="mt-1 text-xs text-muted-foreground">
            or click to browse. PDF, JPG, PNG up to {maxSize / 1024 / 1024}MB
          </p>
          {error && (
            <p className="mt-2 text-xs text-destructive" role="alert">
              {error}
            </p>
          )}
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-muted/20 p-4 flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-background border">
            {isImage ? (
              <Image className="h-6 w-6 text-muted-foreground" />
            ) : isPdf ? (
              <FileText className="h-6 w-6 text-muted-foreground" />
            ) : (
              <File className="h-6 w-6 text-muted-foreground" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium truncate">{value.name}</p>
            <p className="text-xs text-muted-foreground">
              {(value.size / 1024).toFixed(1)} KB
            </p>
            {progress > 0 && progress < 100 && (
              <div className="mt-1 h-1.5 w-full rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            )}
          </div>
          <Button type="button" variant="ghost" size="icon" onClick={removeFile} disabled={disabled}>
            <X className="h-4 w-4" />
            <span className="sr-only">Remove file</span>
          </Button>
        </div>
      )}
    </div>
  )
}

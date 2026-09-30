"use client"

import * as React from "react"
import { useDropzone } from "react-dropzone"
import { X, Upload, File, Image } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export interface FileUploadProps extends React.HTMLAttributes<HTMLDivElement> {
  onChange?: (files: File[]) => void
  value?: File[]
  maxFiles?: number
  maxSize?: number // in bytes
  accept?: Record<string, string[]>
  onError?: (error: string) => void
}

export function FileUpload({
  onChange,
  value = [],
  maxFiles = 5,
  maxSize = 5 * 1024 * 1024, // 5MB
  accept = {
    'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
    'application/pdf': ['.pdf'],
  },
  onError,
  className,
  ...props
}: FileUploadProps) {
  const [files, setFiles] = React.useState<File[]>(value)

  const onDrop = React.useCallback(
    (acceptedFiles: File[], rejectedFiles: any[]) => {
      if (rejectedFiles.length > 0) {
        const errors = rejectedFiles.map(file => {
          if (file.size > maxSize) {
            return `File ${file.name} is too large. Maximum size is ${maxSize / 1024 / 1024}MB.`
          }
          return `File ${file.name} is not an accepted file type.`
        })
        onError?.(errors.join(" "))
        return
      }

      const newFiles = [...files, ...acceptedFiles].slice(0, maxFiles)
      setFiles(newFiles)
      onChange?.(newFiles)
    },
    [files, maxFiles, maxSize, onChange, onError]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: maxFiles - files.length,
    maxSize,
    accept,
  })

  const removeFile = (index: number) => {
    const newFiles = [...files]
    newFiles.splice(index, 1)
    setFiles(newFiles)
    onChange?.(newFiles)
  }

  const isImage = (file: File) => file.type.startsWith('image/')

  return (
    <div className={cn("space-y-4", className)} {...props}>
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors",
          isDragActive
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/25 hover:border-primary/50"
        )}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
        <p className="mt-2 text-sm text-muted-foreground">
          {isDragActive ? (
            "Drop the files here..."
          ) : (
            <>
              Drag & drop files here, or click to select files
              <br />
              <span className="text-xs">
                (Max {maxFiles} files, up to {maxSize / 1024 / 1024}MB each)
              </span>
            </>
          )}
        </p>
      </div>
      {files.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {files.map((file, index) => (
            <div
              key={file.name + index}
              className="relative group rounded-lg border p-2 flex items-center gap-2"
            >
              {isImage(file) ? (
                <Image className="h-5 w-5 text-muted-foreground" />
              ) : (
                <File className="h-5 w-5 text-muted-foreground" />
              )}
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium truncate">{file.name}</p>
                <p className="text-xs text-muted-foreground">
                  {(file.size / 1024).toFixed(1)}KB
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => removeFile(index)}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Remove file</span>
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
} 
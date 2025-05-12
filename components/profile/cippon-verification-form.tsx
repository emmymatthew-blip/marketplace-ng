"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { UploadIcon as FileUpload, Upload } from "lucide-react"

interface CipponVerificationFormProps {
  isVerified: boolean
  cipponId?: string
  onSubmit: (data: { cipponId: string; verificationDocument: string }) => Promise<void>
}

export function CipponVerificationForm({ isVerified, cipponId, onSubmit }: CipponVerificationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formCipponId, setFormCipponId] = useState(cipponId || "")
  const [document, setDocument] = useState<string>("")
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formCipponId.trim()) {
      toast({
        title: "CIPPON ID required",
        description: "Please enter your CIPPON ID.",
        variant: "destructive",
      })
      return
    }

    if (!document) {
      toast({
        title: "Verification document required",
        description: "Please upload a verification document.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      await onSubmit({
        cipponId: formCipponId,
        verificationDocument: document,
      })

      toast({
        title: "Verification request submitted",
        description: "Your CIPPON verification request has been submitted for review.",
      })
    } catch (error) {
      console.error("Error submitting verification request:", error)
      toast({
        title: "Failed to submit verification request",
        description: "There was an error submitting your verification request. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleFileUpload = () => {
    // In a real app, this would open a file picker and upload the document
    // For now, we'll just simulate a document upload
    setDocument("/placeholder.svg?height=300&width=300&text=CIPPON+Document")

    toast({
      title: "Document uploaded",
      description: "Your verification document has been uploaded successfully.",
    })
  }

  if (isVerified) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>CIPPON Verification</CardTitle>
          <CardDescription>Your account is verified as a CIPPON member.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md bg-green-50 p-4 dark:bg-green-900/20">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400 dark:text-green-500" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800 dark:text-green-200">Verification successful</h3>
                <div className="mt-2 text-sm text-green-700 dark:text-green-300">
                  <p>Your CIPPON ID: {cipponId}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>CIPPON Verification</CardTitle>
          <CardDescription>Verify your account as a CIPPON member to access printer-specific features.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cippon-id">CIPPON ID</Label>
            <Input
              id="cippon-id"
              value={formCipponId}
              onChange={(e) => setFormCipponId(e.target.value)}
              placeholder="Enter your CIPPON ID"
            />
          </div>

          <div className="space-y-2">
            <Label>Verification Document</Label>
            <div className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center">
              {document ? (
                <div className="text-center">
                  <img
                    src={document || "/placeholder.svg"}
                    alt="Verification Document"
                    className="mx-auto h-32 w-32 object-cover mb-4"
                  />
                  <p className="text-sm text-muted-foreground">Document uploaded successfully</p>
                  <Button type="button" variant="outline" size="sm" className="mt-2" onClick={() => setDocument("")}>
                    Remove
                  </Button>
                </div>
              ) : (
                <div className="text-center">
                  <FileUpload className="mx-auto h-12 w-12 text-muted-foreground" />
                  <p className="mt-2 text-sm font-medium">Upload your CIPPON membership certificate</p>
                  <p className="text-xs text-muted-foreground mt-1">Supported formats: PDF, JPG, PNG (max 5MB)</p>
                  <Button type="button" variant="outline" className="mt-4" onClick={handleFileUpload}>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Document
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="additional-info">Additional Information (Optional)</Label>
            <Textarea
              id="additional-info"
              placeholder="Provide any additional information that might help with verification"
              rows={3}
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button type="submit" disabled={isSubmitting || !formCipponId || !document}>
            {isSubmitting ? "Submitting..." : "Submit for Verification"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

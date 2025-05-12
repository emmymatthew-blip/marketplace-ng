"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"

const disputeFormSchema = z.object({
  reason: z.string({
    required_error: "Please select a reason for the dispute",
  }),
  description: z
    .string()
    .min(20, {
      message: "Description must be at least 20 characters",
    })
    .max(1000, {
      message: "Description must not be longer than 1000 characters",
    }),
  evidence: z.string().optional(),
  proposedResolution: z
    .string()
    .min(20, {
      message: "Proposed resolution must be at least 20 characters",
    })
    .max(500, {
      message: "Proposed resolution must not be longer than 500 characters",
    }),
})

type DisputeFormValues = z.infer<typeof disputeFormSchema>

export function DisputeForm({ agreementId }: { agreementId: string }) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<DisputeFormValues>({
    resolver: zodResolver(disputeFormSchema),
    defaultValues: {
      reason: "",
      description: "",
      evidence: "",
      proposedResolution: "",
    },
  })

  async function onSubmit(data: DisputeFormValues) {
    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/agreements/${agreementId}/dispute`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error("Failed to submit dispute")
      }

      toast({
        title: "Dispute submitted",
        description: "Your dispute has been submitted successfully.",
      })

      router.push(`/agreements/${agreementId}`)
    } catch (error) {
      console.error("Error submitting dispute:", error)
      toast({
        title: "Error",
        description: "Failed to submit dispute. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
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
                Describe the issue in detail, including dates, specific incidents, and how it affects the agreement
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="evidence"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Evidence (Optional)</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  {...field}
                  value={undefined}
                  onChange={(e) => {
                    // In a real implementation, this would handle file uploads
                    field.onChange(e.target.value)
                  }}
                />
              </FormControl>
              <FormDescription>Upload any evidence to support your dispute (images, documents, etc.)</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

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
              <FormDescription>Describe what you believe would be a fair resolution to this dispute</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit Dispute"}
        </Button>
      </form>
    </Form>
  )
}

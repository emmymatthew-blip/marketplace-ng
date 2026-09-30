"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { toast } from "@/components/ui/use-toast"

const notificationFormSchema = z.object({
  marketplaceUpdates: z.boolean().default(false),
  agreementUpdates: z.boolean().default(true),
  newMessages: z.boolean().default(true),
  forumActivity: z.boolean().default(false),
  demoAnnouncements: z.boolean().default(true),
  marketingEmails: z.boolean().default(false),
})

type NotificationFormValues = z.infer<typeof notificationFormSchema>

const defaultValues: NotificationFormValues = {
  marketplaceUpdates: false,
  agreementUpdates: true,
  newMessages: true,
  forumActivity: false,
  demoAnnouncements: true,
  marketingEmails: false,
}

export function NotificationForm({ userId }: { userId: string }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)

  const form = useForm<NotificationFormValues>({
    resolver: zodResolver(notificationFormSchema),
    defaultValues,
  })

  useEffect(() => {
    let cancelled = false
    async function fetchPreferences() {
      try {
        const res = await fetch("/api/users/notification-preferences", { cache: "no-store" })
        if (!res.ok || cancelled) return
        const data = await res.json()
        form.reset({
          marketplaceUpdates: Boolean(data.marketplaceUpdates),
          agreementUpdates: Boolean(data.agreementUpdates),
          newMessages: Boolean(data.newMessages),
          forumActivity: Boolean(data.forumActivity),
          demoAnnouncements: Boolean(data.demoAnnouncements),
          marketingEmails: Boolean(data.marketingEmails),
        })
      } catch {
        // keep default values
      } finally {
        if (!cancelled) setIsFetching(false)
      }
    }
    fetchPreferences()
    return () => {
      cancelled = true
    }
  }, [form])

  async function onSubmit(data: NotificationFormValues) {
    setIsLoading(true)

    try {
      const response = await fetch("/api/users/notification-preferences", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const text = await response.text()
        let message = "Failed to update notification preferences"
        try {
          const parsed = JSON.parse(text)
          if (parsed?.error) message = parsed.error
        } catch {
          if (text) message = text
        }
        throw new Error(message)
      }

      toast({
        title: "Notification preferences updated",
        description: "Your notification preferences have been updated.",
      })

      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update notification preferences. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="marketplaceUpdates"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Marketplace Updates</FormLabel>
                  <FormDescription>
                    Receive notifications about new products and services in the marketplace.
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="agreementUpdates"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Agreement Updates</FormLabel>
                  <FormDescription>Receive notifications about changes to your agreements.</FormDescription>
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="newMessages"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>New Messages</FormLabel>
                  <FormDescription>Receive notifications when you get new messages.</FormDescription>
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="forumActivity"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Forum Activity</FormLabel>
                  <FormDescription>Receive notifications about activity in forums you participate in.</FormDescription>
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="demoAnnouncements"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Demonstration Announcements</FormLabel>
                  <FormDescription>Receive notifications about new demonstrations and events.</FormDescription>
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="marketingEmails"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Marketing Emails</FormLabel>
                  <FormDescription>Receive marketing emails and promotional content.</FormDescription>
                </div>
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" disabled={isLoading || isFetching}>
          {isFetching ? "Loading..." : isLoading ? "Saving..." : "Save preferences"}
        </Button>
      </form>
    </Form>
  )
}

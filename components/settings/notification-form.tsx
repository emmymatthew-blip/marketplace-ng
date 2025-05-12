"use client"

import { useState } from "react"
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

export function NotificationForm({ userId }: { userId: string }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  // In a real app, you would fetch the user's current notification preferences
  const form = useForm<NotificationFormValues>({
    resolver: zodResolver(notificationFormSchema),
    defaultValues: {
      marketplaceUpdates: false,
      agreementUpdates: true,
      newMessages: true,
      forumActivity: false,
      demoAnnouncements: true,
      marketingEmails: false,
    },
  })

  async function onSubmit(data: NotificationFormValues) {
    setIsLoading(true)

    try {
      // In a real app, you would send this data to your API
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Notification preferences updated",
        description: "Your notification preferences have been updated.",
      })

      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update notification preferences. Please try again.",
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

        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : "Save preferences"}
        </Button>
      </form>
    </Form>
  )
}

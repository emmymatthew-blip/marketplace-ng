"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"

const accountFormSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
})

type AccountFormValues = z.infer<typeof accountFormSchema>

export function AccountForm({ user }: { user: any }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues: {
      email: user?.email || "",
    },
  })

  async function onSubmit(data: AccountFormValues) {
    setIsLoading(true)

    try {
      const response = await fetch("/api/users/email", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const text = await response.text()
        let message = "Failed to update email"
        try {
          const data = JSON.parse(text)
          if (data?.error) message = data.error
        } catch {
          if (text) message = text
        }
        throw new Error(message)
      }

      toast({
        title: "Email updated",
        description: "Your email address has been updated.",
      })

      router.refresh()
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to update email. Please try again."
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Your email address" {...field} />
              </FormControl>
              <FormDescription>This is the email address you use to sign in.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Updating..." : "Update email"}
        </Button>

        <div className="border-t pt-6 mt-6">
          <h4 className="text-sm font-medium mb-4">Delete Account</h4>
          <p className="text-sm text-muted-foreground mb-4">Permanently delete your account and all of your content.</p>
          <Button
            variant="destructive"
            onClick={() => {
              toast({
                title: "This feature is not available yet",
                description: "Account deletion is not implemented in this version.",
              })
            }}
          >
            Delete account
          </Button>
        </div>
      </form>
    </Form>
  )
}

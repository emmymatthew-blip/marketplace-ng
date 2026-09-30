"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { UserRoleSelector } from "@/components/user-role-selector"
import { Store, CheckCircle, AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { USER_ROLES } from "@/lib/user-roles"

export function BecomeSellerForm() {
  const { data: session } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  const [selectedRole, setSelectedRole] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Get all seller roles (exclude buyer roles and admin)
  const sellerRoles = [
    ...USER_ROLES.MANUFACTURING,
    ...USER_ROLES.PRINT_SERVICES,
    ...USER_ROLES.SPECIALIZED_SERVICES,
    ...USER_ROLES.DESIGN_CREATIVE,
    ...USER_ROLES.DISTRIBUTION_SALES,
    ...USER_ROLES.TECHNOLOGY_SOFTWARE,
    ...USER_ROLES.CONSULTING_SUPPORT,
    ...USER_ROLES.MEDIA_PUBLISHING,
    ...USER_ROLES.PROMOTIONAL_PRODUCTS,
    ...USER_ROLES.EDUCATIONAL_TRAINING,
    ...USER_ROLES.INDUSTRY_ORGANIZATIONS,
    ...USER_ROLES.END_USERS,
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedRole) {
      toast({
        title: "Role Required",
        description: "Please select a seller role",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/users/become-seller", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sellerRole: selectedRole }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Failed to opt in as seller")
      }

      toast({
        title: "Success!",
        description: "You are now a seller. You can create products and promote on the platform.",
      })

      // Refresh the session and redirect
      router.refresh()
      setTimeout(() => {
        router.push("/dashboard")
      }, 1000)
    } catch {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to opt in as seller",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Store className="h-5 w-5 text-primary" />
          <CardTitle>Become a Seller</CardTitle>
        </div>
        <CardDescription>
          Opt in as a seller to create products, promote your services, and access seller features.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Alert className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>What you'll get</AlertTitle>
          <AlertDescription className="mt-2 space-y-1">
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Create and manage product listings</li>
              <li>Promote your services with demonstrations</li>
              <li>Access seller analytics and insights</li>
              <li>Switch between buyer and seller modes</li>
              <li>Receive inquiries from potential buyers</li>
            </ul>
          </AlertDescription>
        </Alert>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="sellerRole">Select Your Seller Role *</Label>
            <UserRoleSelector
              value={selectedRole}
              onValueChange={setSelectedRole}
              placeholder="Choose your seller role..."
            />
            <p className="text-xs text-muted-foreground">
              Select the role that best describes your business or profession
            </p>
          </div>

          <Button type="submit" disabled={!selectedRole || isSubmitting} className="w-full">
            {isSubmitting ? (
              "Processing..."
            ) : (
              <>
                <Store className="h-4 w-4 mr-2" />
                Become a Seller
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

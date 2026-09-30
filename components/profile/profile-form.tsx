"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { motion } from "framer-motion"
import { Save, Loader2 } from "lucide-react"
import { TEAM_SIZE_OPTIONS } from "@/lib/company-profile"

interface ProfileFormProps {
  user: {
    id: string
    name: string
    email: string
    image?: string
    role: string
    isVerified: boolean
    cipponId?: string
    phone?: string
    location?: string
    companyName?: string
    bio?: string
    yearsInBusiness?: number
    teamSize?: string
  }
}

export function ProfileForm({ user }: ProfileFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)
    const data = {
      name: formData.get("name") as string,
      phone: formData.get("phone") as string,
      location: formData.get("location") as string,
      companyName: user.role === "MANUFACTURER" ? (formData.get("companyName") as string) : undefined,
      cipponId: user.role === "END_USER_PRINTER" ? (formData.get("cipponId") as string) : undefined,
      yearsInBusiness: formData.get("yearsInBusiness") as string,
      teamSize: formData.get("teamSize") as string,
      bio: formData.get("bio") as string,
    }

    try {
      const response = await fetch("/api/users/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error("Failed to update profile")
      }

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      })

      router.refresh()
    } catch {
      toast({
        title: "Failed to update profile",
        description: "There was an error updating your profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-primary/5 border-b">
        <h3 className="text-lg font-semibold text-primary">Edit Profile</h3>
        <p className="text-sm text-muted-foreground">
          Update your personal information and preferences
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6 pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-2"
            >
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                defaultValue={user.name}
                className="bg-background/40 backdrop-blur-sm"
                required
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-2"
            >
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                defaultValue={user.email}
                className="bg-muted"
                disabled
              />
              <p className="text-xs text-muted-foreground">Email cannot be changed</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-2"
            >
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                name="phone"
                defaultValue={user.phone || ""}
                className="bg-background/40 backdrop-blur-sm"
                placeholder="+234 XXX XXX XXXX"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="space-y-2"
            >
              <Label htmlFor="location">Location</Label>
              <Select name="location" defaultValue={user.location || ""}>
                <SelectTrigger id="location" className="bg-background/40 backdrop-blur-sm">
                  <SelectValue placeholder="Select your location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lagos">Lagos</SelectItem>
                  <SelectItem value="abuja">Abuja</SelectItem>
                  <SelectItem value="port-harcourt">Port Harcourt</SelectItem>
                  <SelectItem value="kano">Kano</SelectItem>
                  <SelectItem value="ibadan">Ibadan</SelectItem>
                  <SelectItem value="enugu">Enugu</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </motion.div>

            {user.role === "MANUFACTURER" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="space-y-2 md:col-span-2"
              >
                <Label htmlFor="companyName">Company Name</Label>
                <Input
                  id="companyName"
                  name="companyName"
                  defaultValue={user.companyName || ""}
                  className="bg-background/40 backdrop-blur-sm"
                  placeholder="Your company name"
                />
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65 }}
              className="space-y-2"
            >
              <Label htmlFor="yearsInBusiness">Years in Business</Label>
              <Input
                id="yearsInBusiness"
                name="yearsInBusiness"
                type="number"
                min="0"
                defaultValue={user.yearsInBusiness != null ? String(user.yearsInBusiness) : ""}
                className="bg-background/40 backdrop-blur-sm"
                placeholder="e.g. 15"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="space-y-2"
            >
              <Label htmlFor="teamSize">Team Size</Label>
              <select
                id="teamSize"
                name="teamSize"
                defaultValue={user.teamSize || ""}
                className="flex h-10 w-full rounded-md border border-input bg-background/40 px-3 py-2 text-sm backdrop-blur-sm"
              >
                <option value="">Select team size</option>
                {TEAM_SIZE_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </motion.div>

            {user.role === "END_USER_PRINTER" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="space-y-2 md:col-span-2"
              >
                <Label htmlFor="cipponId">CIPPON ID</Label>
                <Input
                  id="cipponId"
                  name="cipponId"
                  defaultValue={user.cipponId || ""}
                  className="bg-background/40 backdrop-blur-sm"
                  placeholder="Enter your CIPPON ID"
                />
                {!user.isVerified && (
                  <p className="text-xs text-muted-foreground">
                    Enter your CIPPON ID to get verified. Verification may take 1-2 business days.
                  </p>
                )}
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="space-y-2 md:col-span-2"
            >
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                name="bio"
                placeholder="Tell us about yourself or your business..."
                rows={4}
                defaultValue={user.bio || ""}
                className="bg-background/40 backdrop-blur-sm resize-none"
              />
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex justify-end gap-4"
          >
            <Button
              variant="outline"
              type="button"
              onClick={() => router.back()}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </motion.div>
        </form>
      </CardContent>
    </Card>
  )
}

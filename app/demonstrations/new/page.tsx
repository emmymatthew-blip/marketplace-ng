import type { Metadata } from "next"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { CalendarIcon, Clock } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { prisma } from "@/lib/prisma"

export const metadata: Metadata = {
  title: "Create Demonstration | NG Marketplace",
  description: "Schedule a new product demonstration for the marketplace",
}

async function getCurrentUser(email: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, role: true }
    })
    return user
  } catch (error) {
    console.error("Failed to fetch current user:", error)
    return null
  }
}

export default async function NewDemonstrationPage() {
  const session = await getServerSession()

  if (!session?.user?.email) {
    redirect("/login")
  }

  const user = await getCurrentUser(session.user.email)

  if (!user) {
    redirect("/login")
  }

  // Only manufacturers can create demonstrations
  if (user.role !== "MANUFACTURER") {
    redirect("/demonstrations")
  }

  async function createDemonstration(formData: FormData) {
    "use server"

    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const category = formData.get("category") as string
    const date = formData.get("date") as string
    const time = formData.get("time") as string
    const price = formData.get("price") as string
    const videoUrl = formData.get("videoUrl") as string
    const isPaid = formData.get("isPaid") === "on"

    if (!title || !description || !category || !date || !time) {
      return { error: "All required fields must be filled" }
    }

    const schedule = new Date(`${date}T${time}`)

    try {
      const currentUser = await getCurrentUser(session?.user?.email || "")
      if (!currentUser) {
        return { error: "User not found" }
      }

      await prisma.demoClass.create({
        data: {
          title,
          description,
          category,
          schedule,
          price: isPaid ? Number.parseFloat(price) : 0,
          isPaid,
          status: "PENDING",
          manufacturerId: currentUser.id,
          videoUrl: videoUrl || null,
        }
      })

      redirect("/demonstrations")
    } catch (error) {
      console.error("Failed to create demonstration:", error)
      return { error: "Failed to create demonstration. Please try again." }
    }
  }

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle>Schedule a New Demonstration</CardTitle>
          <CardDescription>
            Share your expertise and products with potential customers through a live or recorded demonstration.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={createDemonstration as any} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" name="title" placeholder="Enter a descriptive title for your demonstration" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Provide details about what will be covered in the demonstration"
                rows={5}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <select id="category" name="category" className="w-full p-2 border rounded-md" required>
                <option value="">Select a category</option>
                <option value="Printing Equipment">Printing Equipment</option>
                <option value="Materials">Materials</option>
                <option value="Software">Software</option>
                <option value="Techniques">Techniques</option>
                <option value="Maintenance">Maintenance</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <div className="relative">
                  <CalendarIcon
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <Input id="date" name="date" type="date" className="pl-10" required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="time">Time</Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <Input id="time" name="time" type="time" className="pl-10" required />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="videoUrl">Video URL (Optional)</Label>
              <Input id="videoUrl" name="videoUrl" placeholder="Link to a pre-recorded demonstration video" />
              <p className="text-xs text-gray-500">
                You can provide a link to a pre-recorded video or leave this blank for live demonstrations.
              </p>
            </div>

            <div className="flex items-start space-x-2">
              <input type="checkbox" id="isPaid" name="isPaid" className="mt-1" />
              <div>
                <Label htmlFor="isPaid">This is a paid demonstration</Label>
                <p className="text-xs text-gray-500">
                  Check this if you want to charge attendees for this demonstration.
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price (₦)</Label>
              <Input id="price" name="price" type="number" placeholder="0.00" min="0" step="0.01" />
            </div>

            <Button type="submit" className="w-full">
              Schedule Demonstration
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

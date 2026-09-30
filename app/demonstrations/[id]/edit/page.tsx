"use client"

import { useEffect, useState, use } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { CalendarIcon, Clock } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { loginWithCallback } from "@/lib/auth-urls"
import { canManageOwnDemonstrations } from "@/lib/user-roles"

interface DemoClass {
  id: string
  title: string
  description: string
  category: string
  schedule: Date
  date?: string
  time?: string
  price: number
  isPaid: boolean
  status: string
  manufacturerId: string
  videoUrl: string | null
  hasPendingUpdateRequest?: boolean
  pendingUpdateCount?: number
}

// Mock data for development
const mockDemonstration: DemoClass = {
  id: "demo1",
  title: "UV Printing Masterclass",
  description: "Learn advanced UV printing techniques for various materials. Live demonstration of color management and quality control.",
  category: "Printing Equipment",
  schedule: new Date("2024-04-15T14:00:00Z"),
  date: "2024-04-15",
  time: "14:00",
  price: 5000,
  isPaid: true,
  status: "UPCOMING",
  manufacturerId: "user1",
  videoUrl: "https://example.com/video",
}

export default function EditDemonstrationPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const router = useRouter()
  const { data: session, status } = useSession()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [demonstration, setDemonstration] = useState<DemoClass | null>(null)
  const [isDevMode] = useState(process.env.NODE_ENV === "development")

  // Check authentication and authorization
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push(loginWithCallback(`/demonstrations/${resolvedParams.id}/edit`))
      return
    }

    if (status === "authenticated" && !canManageOwnDemonstrations(session.user.role)) {
      toast({
        title: "Access Denied",
        description: "Only manufacturers can edit demonstrations.",
        variant: "destructive",
      })
      router.push("/demonstrations")
      return
    }
  }, [status, session, router, resolvedParams.id, toast])

  // Fetch demonstration data
  useEffect(() => {
    const fetchDemonstration = async () => {
      if (!session?.user) return

      try {
        const response = await fetch(`/api/demos/${resolvedParams.id}`)
        
        if (!response.ok) {
          if (isDevMode) {
            // In development, use mock data
            const mockData = { ...mockDemonstration }
            mockData.manufacturerId = session.user.id // Set current user as owner
            setDemonstration(mockData)
            toast({
              title: "Development Mode",
              description: "Using mock data for demonstration.",
            })
          } else {
            throw new Error("Failed to fetch demonstration")
          }
        } else {
          const data = await response.json()
          
          // Check if the user owns this demonstration
          if (data.manufacturerId !== session.user.id) {
            toast({
              title: "Access Denied",
              description: "You can only edit your own demonstrations.",
              variant: "destructive",
            })
            router.push("/demo-access/my-requests")
            return
          }

          // Convert schedule to local date and time
          const schedule = new Date(data.schedule)
          data.date = schedule.toISOString().split('T')[0]
          data.time = schedule.toTimeString().slice(0, 5)
          
          setDemonstration(data)
        }
      } catch (error) {
        if (isDevMode) {
          // In development, use mock data
          const mockData = { ...mockDemonstration }
          mockData.manufacturerId = session.user.id // Set current user as owner
          setDemonstration(mockData)
          toast({
            title: "Development Mode",
            description: "Using mock data for demonstration.",
          })
        } else {
          toast({
            title: "Error",
            description: "Failed to load demonstration details",
            variant: "destructive",
          })
        }
      } finally {
        setIsLoading(false)
      }
    }

    if (session?.user) {
      fetchDemonstration()
    }
  }, [resolvedParams.id, session, router, toast, isDevMode])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsLoading(true)

    const formData = new FormData(event.currentTarget)
    const schedule = new Date(`${formData.get("date")}T${formData.get("time")}`)

    try {
      if (isDevMode) {
        // In development, simulate successful update
        await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API delay
        toast({
          title: "Development Mode",
          description: "Demonstration updated successfully (mock)",
        })
        router.push("/demo-access/my-requests")
        return
      }

      const response = await fetch(`/api/demos/${resolvedParams.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: formData.get("title"),
          description: formData.get("description"),
          category: formData.get("category"),
          schedule,
          price: formData.get("isPaid") === "on" ? Number(formData.get("price")) : 0,
          isPaid: formData.get("isPaid") === "on",
          videoUrl: formData.get("videoUrl") || null,
        }),
      })

      const result = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(result?.error || "Failed to update demonstration")

      toast({
        title: result?.mode === "REQUEST_CREATED" ? "Changes submitted" : "Success",
        description:
          result?.mode === "REQUEST_CREATED"
            ? "Your update request is pending admin approval."
            : "Demonstration updated successfully",
      })
      router.push("/demo-access/my-requests")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update demonstration",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full py-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>
                {demonstration &&
                (demonstration.status === "APPROVED" ||
                  demonstration.status === "SCHEDULED" ||
                  demonstration.status === "COMPLETED" ||
                  demonstration.status === "LIVE")
                  ? "Request Changes"
                  : "Edit Demonstration"}
              </CardTitle>
              <CardDescription>
                {demonstration &&
                (demonstration.status === "APPROVED" ||
                  demonstration.status === "SCHEDULED" ||
                  demonstration.status === "COMPLETED" ||
                  demonstration.status === "LIVE")
                  ? "Approved weekly demos require admin review before changes are published."
                  : "Update your demonstration details and schedule."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center p-6">
                  <div className="text-center">Loading demonstration details...</div>
                </div>
              ) : demonstration ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {demonstration.hasPendingUpdateRequest ? (
                    <div className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
                      Changes pending approval ({demonstration.pendingUpdateCount || 1}).
                    </div>
                  ) : null}
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input 
                      id="title" 
                      name="title" 
                      defaultValue={demonstration.title}
                      placeholder="Enter a descriptive title for your demonstration" 
                      required 
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      defaultValue={demonstration.description}
                      placeholder="Provide details about what will be covered in the demonstration"
                      rows={5}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <select 
                      id="category" 
                      name="category" 
                      defaultValue={demonstration.category}
                      className="w-full p-2 border rounded-md" 
                      required
                    >
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
                        <Input 
                          id="date" 
                          name="date" 
                          type="date" 
                          defaultValue={demonstration.date}
                          className="pl-10" 
                          required 
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="time">Time</Label>
                      <div className="relative">
                        <Clock 
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
                          size={18} 
                        />
                        <Input 
                          id="time" 
                          name="time" 
                          type="time" 
                          defaultValue={demonstration.time}
                          className="pl-10" 
                          required 
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="videoUrl">Video URL (Optional)</Label>
                    <Input 
                      id="videoUrl" 
                      name="videoUrl" 
                      defaultValue={demonstration.videoUrl || ""}
                      placeholder="Optional supplementary video link (e.g. short clip)" 
                    />
                    <p className="text-xs text-gray-500">
                      Optional — for hybrid sessions or extra context. Full product video belongs on your listing.
                    </p>
                  </div>

                  <div className="flex items-start space-x-2">
                    <input 
                      type="checkbox" 
                      id="isPaid" 
                      name="isPaid" 
                      defaultChecked={demonstration.isPaid}
                      className="mt-1" 
                    />
                    <div>
                      <Label htmlFor="isPaid">This is a paid demonstration</Label>
                      <p className="text-xs text-gray-500">
                        Check this if you want to charge attendees for this demonstration.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="price">Price (₦)</Label>
                    <Input 
                      id="price" 
                      name="price" 
                      type="number" 
                      defaultValue={demonstration.price}
                      placeholder="0.00" 
                      min="0" 
                      step="0.01" 
                    />
                  </div>

                  <div className="flex gap-4">
                    <Button type="submit" disabled={isLoading || demonstration.hasPendingUpdateRequest}>
                      {isLoading
                        ? "Submitting..."
                        : demonstration.status === "APPROVED" ||
                            demonstration.status === "SCHEDULED" ||
                            demonstration.status === "COMPLETED" ||
                            demonstration.status === "LIVE"
                          ? "Request Changes"
                          : "Update Demonstration"}
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={() => router.push("/demo-access/my-requests")}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="flex items-center justify-center p-6">
                  <div className="text-center text-muted-foreground">
                    Demonstration not found or you don't have permission to edit it.
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
    </div>
  )
} 
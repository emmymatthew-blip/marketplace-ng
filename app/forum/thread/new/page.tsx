import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { ThreadForm } from "@/components/forum/thread-form"
import { ForumGuidelines } from "@/components/forum/forum-guidelines"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Breadcrumb } from "@/components/ui/breadcrumb"

export const metadata: Metadata = {
  title: "Create New Thread | PrintMarket NG Forum",
  description: "Start a new discussion in the PrintMarket NG forum",
}

async function getCategories() {
  // In a real app, fetch from your API
  return [
    { id: "cat-general-id", name: "General Discussion" },
    { id: "cat-tech-id", name: "Technology" },
    { id: "cat-business-id", name: "Business" },
    { id: "cat-materials-id", name: "Materials" },
  ]
}

export default async function NewThreadPage() {
  const categories = await getCategories()

  async function createThread(formData: FormData) {
    "use server"

    // In a real app, validate and save to database
    const title = formData.get("title") as string
    const content = formData.get("content") as string
    const categoryId = formData.get("categoryId") as string

    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Redirect to the forum page after submission
    redirect("/forum")
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <Breadcrumb
        items={[
          { label: "Forum", href: "/forum" },
          { label: "New Thread", href: "/forum/thread/new", active: true },
        ]}
      />

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Create New Thread</CardTitle>
            </CardHeader>
            <CardContent>
              <ThreadForm categories={categories} createThread={createThread} />
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Forum Guidelines</CardTitle>
            </CardHeader>
            <CardContent>
              <ForumGuidelines />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

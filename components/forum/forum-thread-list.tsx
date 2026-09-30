import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MessageSquare, ThumbsUp } from "lucide-react"

interface ForumThread {
  id: string
  title: string
  excerpt: string
  author: {
    id: string
    name: string
    image?: string
    role: string
    isVerified: boolean
  }
  category: {
    id: string
    name: string
  }
  replies: number
  likes: number
  createdAt: string
}

interface ForumThreadListProps {
  threads: ForumThread[]
  emptyMessage?: string
}

export function ForumThreadList({ threads, emptyMessage = "No threads found." }: ForumThreadListProps) {
  if (!threads.length) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">{emptyMessage}</p>
          <Button asChild className="mt-4">
            <Link href="/forum/new">Create Thread</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {threads.map((thread) => (
        <Link 
          href={`/forum/thread/${thread.id}`} 
          key={thread.id}
          className="block transition-all duration-200 hover:scale-[1.01] hover:shadow-lg"
        >
          <Card className="cursor-pointer">
            <CardHeader className="pb-2">
              <div className="flex justify-between">
                <CardTitle className="text-lg group-hover:text-primary">{thread.title}</CardTitle>
                <Badge>{thread.category.name}</Badge>
              </div>
              <CardDescription className="flex items-center">
                <Avatar className="h-5 w-5 mr-1">
                  <AvatarImage src={thread.author.image || "/placeholder.svg"} alt={thread.author.name} />
                  <AvatarFallback>{thread.author.name.substring(0, 2)}</AvatarFallback>
                </Avatar>
                {thread.author.name} • {thread.createdAt}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{thread.excerpt}</p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="flex items-center text-sm text-muted-foreground">
                <MessageSquare className="mr-1 h-4 w-4" />
                {thread.replies} replies
                <ThumbsUp className="ml-3 mr-1 h-4 w-4" />
                {thread.likes} likes
              </div>
            </CardFooter>
          </Card>
        </Link>
      ))}
    </div>
  )
}

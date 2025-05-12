import { Card, CardDescription, CardFooter, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MessageSquare, ThumbsUp, ArrowRight, Clock } from "lucide-react"
import Link from "next/link"

export function ForumHighlights() {
  // This would typically come from an API or database
  const posts = [
    {
      id: 1,
      title: "Best UV printer for small business?",
      author: "PrinterNewbie",
      authorImage: "/images/Canon-pixma-2 1.png",
      category: "UV",
      replies: 12,
      likes: 8,
      time: "2 hours ago",
      excerpt: "Looking for recommendations for a reliable UV printer that won't break the bank. Any suggestions from experienced users?",
    },
    {
      id: 2,
      title: "Troubleshooting color calibration issues",
      author: "ColorExpert",
      authorImage: "/images/C 1.png",
      category: "Pre-Press",
      replies: 24,
      likes: 15,
      time: "1 day ago",
      excerpt: "Having trouble with color consistency across different substrates. Any tips on proper calibration procedures?",
    },
    {
      id: 3,
      title: "Recommended suppliers for eco-solvent ink",
      author: "GreenPrinter",
      authorImage: "/images/image 87.png",
      category: "Consumables",
      replies: 7,
      likes: 5,
      time: "3 days ago",
      excerpt: "Looking for reliable suppliers of eco-solvent inks in Nigeria. Any recommendations based on quality and price?",
    },
  ]

  return (
    <div className="grid gap-4 pt-6">
      {posts.map((post) => (
        <Card key={post.id} className="group hover:shadow-lg transition-all duration-300">
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <CardTitle className="text-lg group-hover:text-primary transition-colors">
                  {post.title}
                </CardTitle>
                <CardDescription className="flex items-center gap-2">
                  <Avatar className="h-6 w-6 border border-background">
                    <AvatarImage src={post.authorImage} alt={post.author} />
                    <AvatarFallback className="bg-primary/10 text-primary text-xs">
                      {post.author.substring(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium text-foreground">{post.author}</span>
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {post.time}
                  </span>
                </CardDescription>
              </div>
              <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">
                {post.category}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pb-2">
            <p className="text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>
          </CardContent>
          <CardFooter className="flex justify-between pt-2">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <MessageSquare className="h-4 w-4 text-primary" />
                {post.replies}
              </div>
              <div className="flex items-center gap-1">
                <ThumbsUp className="h-4 w-4 text-primary" />
                {post.likes}
              </div>
            </div>
            <Button asChild variant="ghost" size="sm" className="group-hover:text-primary">
              <Link href={`/forum/post/${post.id}`} className="flex items-center gap-2">
                View Thread
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
      <Button asChild variant="link" className="mt-2 text-primary hover:text-primary/80">
        <Link href="/forum" className="flex items-center gap-2">
          Visit the Forum
          <ArrowRight className="h-4 w-4" />
        </Link>
      </Button>
    </div>
  )
}

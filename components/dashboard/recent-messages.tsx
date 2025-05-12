import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface Message {
  id: string
  sender: {
    id: string
    name: string
    image?: string
  }
  timestamp: string
  preview: string
  isRead: boolean
}

interface RecentMessagesProps {
  messages: Message[]
}

export function RecentMessages({ messages }: RecentMessagesProps) {
  if (!messages.length) {
    return (
      <Card>
        <CardContent className="pt-6 text-center">
          <p className="text-muted-foreground">You don't have any messages yet.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-4">
      {messages.map((message) => (
        <Card key={message.id} className={message.isRead ? "" : "border-primary"}>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={message.sender.image || "/placeholder.svg?height=32&width=32"}
                  alt={message.sender.name}
                />
                <AvatarFallback>
                  {message.sender.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-base">{message.sender.name}</CardTitle>
                <CardDescription>{message.timestamp}</CardDescription>
              </div>
              {!message.isRead && (
                <div className="ml-auto">
                  <span className="flex h-2 w-2 rounded-full bg-primary"></span>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{message.preview}</p>
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" size="sm" className="w-full">
              <Link href={`/messages/${message.id}`}>Reply</Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

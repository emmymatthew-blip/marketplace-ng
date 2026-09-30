"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MessageSquare, FileText, Inbox } from "lucide-react"

interface MessageItem {
  id: string
  senderName: string
  senderImage?: string
  preview: string
  time: string
  isRead?: boolean
}

interface InquiryItem {
  id: string
  from: string
  product?: string
  time: string
}

interface AgreementUpdateItem {
  id: string
  title: string
  counterparty: string
  status: string
  time: string
}

interface RecentActivityPanelProps {
  messages?: MessageItem[]
  inquiries?: InquiryItem[]
  agreementUpdates?: AgreementUpdateItem[]
}

export function RecentActivityPanel({
  messages = [],
  inquiries = [],
  agreementUpdates = [],
}: RecentActivityPanelProps) {
  return (
    <div className="space-y-6">
      <Card className="rounded-xl border border-border shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Recent messages</CardTitle>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/messages">View all</Link>
          </Button>
        </CardHeader>
        <CardContent>
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-6 text-center text-sm text-muted-foreground">
              <MessageSquare className="h-8 w-8 mb-2 opacity-50" />
              <p>No recent messages</p>
            </div>
          ) : (
            <ul className="space-y-3">
              {messages.slice(0, 4).map((msg) => (
                <li key={msg.id}>
                  <Link href={`/messages/${msg.id}`} className="flex gap-3 rounded-lg p-2 hover:bg-muted/50 transition-colors">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={msg.senderImage} />
                      <AvatarFallback>{msg.senderName[0]}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate">{msg.senderName}</p>
                      <p className="text-xs text-muted-foreground truncate">{msg.preview}</p>
                    </div>
                    <span className="text-xs text-muted-foreground shrink-0">{msg.time}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Card className="rounded-xl border border-border shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Recent inquiries</CardTitle>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/messages">View all</Link>
          </Button>
        </CardHeader>
        <CardContent>
          {inquiries.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-6 text-center text-sm text-muted-foreground">
              <Inbox className="h-8 w-8 mb-2 opacity-50" />
              <p>No inquiries yet</p>
            </div>
          ) : (
            <ul className="space-y-2">
              {inquiries.slice(0, 3).map((q) => (
                <li key={q.id} className="flex justify-between items-start text-sm">
                  <div>
                    <p className="font-medium">{q.from}</p>
                    {q.product && <p className="text-xs text-muted-foreground">{q.product}</p>}
                  </div>
                  <span className="text-xs text-muted-foreground">{q.time}</span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Card className="rounded-xl border border-border shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Agreement updates</CardTitle>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/agreements">View all</Link>
          </Button>
        </CardHeader>
        <CardContent>
          {agreementUpdates.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-6 text-center text-sm text-muted-foreground">
              <FileText className="h-8 w-8 mb-2 opacity-50" />
              <p>No recent updates</p>
            </div>
          ) : (
            <ul className="space-y-2">
              {agreementUpdates.slice(0, 3).map((a) => (
                <li key={a.id} className="flex justify-between items-start text-sm">
                  <div>
                    <p className="font-medium">{a.title}</p>
                    <p className="text-xs text-muted-foreground">With {a.counterparty} · {a.status}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{a.time}</span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

import { useState, useEffect } from "react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ThumbsUp, Reply, MoreHorizontal, Flag, Download, ExternalLink, ChevronDown, ChevronUp } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Image from "next/image"

export interface ForumReply {
  id: string
  content: string
  author: {
    id: string
    name: string
    image?: string
    role: string
    isVerified: boolean
    company: string
    joinDate: string
    expertise?: string[]
    certifications?: string[]
  }
  createdAt: string
  likes: number
  isAuthor?: boolean
  attachments?: {
    type: string
    url: string
    caption: string
  }[]
  replies?: ForumReply[]
}

interface ForumReplyListProps {
  replies: ForumReply[]
  onReply: (replyId: string) => void
  onLike: (replyId: string) => void
  onReport: (replyId: string) => void
  level?: number
}

type Attachment = {
  type: string
  url: string
  caption: string
}

export function ForumReplyList({ replies, onReply, onLike, onReport, level = 0 }: ForumReplyListProps) {
  const [likedReplies, setLikedReplies] = useState<Record<string, boolean>>({})
  const [expandedImages, setExpandedImages] = useState<Record<string, boolean>>({})
  const [expandedReplies, setExpandedReplies] = useState<Record<string, boolean>>({})

  // Initialize all replies as collapsed by default
  useEffect(() => {
    const initialState: Record<string, boolean> = {}
    replies.forEach(reply => {
      initialState[reply.id] = false
    })
    setExpandedReplies(initialState)
  }, [replies])

  const handleLike = (replyId: string) => {
    setLikedReplies((prev) => ({ ...prev, [replyId]: !prev[replyId] }))
    onLike(replyId)
  }

  const toggleImageExpansion = (imageId: string) => {
    setExpandedImages((prev) => ({ ...prev, [imageId]: !prev[imageId] }))
  }

  const toggleRepliesExpansion = (replyId: string) => {
    setExpandedReplies((prev) => ({ ...prev, [replyId]: !prev[replyId] }))
  }

  const isImageFile = (url: string) => {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp']
    return imageExtensions.some(ext => url.toLowerCase().endsWith(ext))
  }

  const getPreviewImage = (attachment: Attachment) => {
    if (!attachment) return '/images/file-types/file.svg'
    
    // If it's an image and the URL starts with /images/, use it directly
    if (isImageFile(attachment.url) && attachment.url.startsWith('/images/')) {
      return attachment.url
    }
    
    // For external images, still use them directly
    if (isImageFile(attachment.url)) {
      return attachment.url
    }
    
    // For documents, use our file type icons
    if (attachment.url.endsWith('.pdf')) return '/images/file-types/pdf.svg'
    if (attachment.url.endsWith('.doc') || attachment.url.endsWith('.docx')) return '/images/file-types/word.svg'
    if (attachment.url.endsWith('.xls') || attachment.url.endsWith('.xlsx')) return '/images/file-types/excel.svg'
    
    // Default file icon
    return '/images/file-types/file.svg'
  }

  const maxLevel = 3 // Maximum nesting level

  return (
    <div className="space-y-4">
      {replies.map((reply) => (
        <div 
          key={reply.id} 
          className={`${level > 0 ? 'ml-2 sm:ml-4 md:ml-8 border-l-2 border-primary/10 pl-2 sm:pl-4' : ''}`}
        >
          <Card className="bg-background/60 hover:bg-background/80 transition-all duration-300 shadow-md hover:shadow-lg">
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
              <div className="flex items-start gap-2 min-w-0">
                <div className="relative">
                  <Avatar className={`h-8 w-8 flex-shrink-0 ring-2 ${
                    reply.author.isVerified ? 'ring-primary/50' : 'ring-muted'
                  } ${
                    reply.author.role === 'MANUFACTURER' ? 'border-amber-500/50' :
                    reply.author.role === 'CERTIFIED_CONSULTANT' ? 'border-emerald-500/50' :
                    reply.author.role === 'VERIFIED_BUSINESS' ? 'border-blue-500/50' :
                    'border-muted'
                  } border-2`}>
                    <AvatarImage src={reply.author.image} alt={reply.author.name} />
                    <AvatarFallback>{reply.author.name.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  {reply.author.isVerified && (
                    <div className="absolute -bottom-1 -right-1 bg-primary text-white rounded-full p-0.5 shadow-lg">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20.293 5.293L9 16.586l-4.293-4.293a1 1 0 0 0-1.414 1.414l5 5a1 1 0 0 0 1.414 0l12-12a1 1 0 0 0-1.414-1.414z" fill="currentColor"/>
                      </svg>
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold truncate">{reply.author.name}</span>
                    {reply.author.isVerified && (
                      <Badge variant="secondary" className="text-xs flex-shrink-0 bg-primary/10 text-primary border-primary/20">
                        Verified
                      </Badge>
                    )}
                    <Badge variant="outline" className={`text-xs flex-shrink-0 ${
                      reply.author.role === 'MANUFACTURER' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                      reply.author.role === 'CERTIFIED_CONSULTANT' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                      reply.author.role === 'VERIFIED_BUSINESS' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                      'bg-muted/50'
                    }`}>
                      {reply.author.role}
                    </Badge>
                    <span className="text-xs text-muted-foreground flex-shrink-0 bg-muted/30 px-2 py-0.5 rounded-full">
                      {reply.createdAt}
                    </span>
                  </div>
                  {reply.author.expertise && reply.author.expertise.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {reply.author.expertise.map((exp, index) => (
                        <span key={index} className="text-xs text-muted-foreground bg-muted/20 px-1.5 py-0.5 rounded">
                          {exp}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="flex-shrink-0 hover:bg-muted/50">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">More options</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                  {level < maxLevel && (
                    <DropdownMenuItem onClick={() => onReply(reply.id)} className="gap-2">
                      <Reply className="h-4 w-4" />
                      Reply
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={() => onReport(reply.id)} className="gap-2 text-red-500">
                    <Flag className="h-4 w-4" />
                    Report
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardHeader>
            <CardContent>
              <div className="break-words">
                <p className="text-sm leading-relaxed">{reply.content}</p>
              </div>
              {reply.attachments && reply.attachments.length > 0 && (
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {reply.attachments.map((attachment, index) => (
                    <div key={index} className="rounded-lg border group relative bg-muted/5 hover:bg-muted/10 transition-colors">
                      <div className="aspect-[4/3] relative overflow-hidden rounded-t-lg">
                        <Image
                          src={getPreviewImage(attachment)}
                          alt={attachment.caption}
                          className={isImageFile(attachment.url) ? "object-cover" : "object-contain p-4"}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                          <div className="flex gap-2">
                            {isImageFile(attachment.url) && (
                              <Button 
                                variant="secondary" 
                                size="sm" 
                                onClick={(e) => {
                                  e.preventDefault()
                                  toggleImageExpansion(`${reply.id}-${index}`)
                                }}
                                className="bg-white/90 hover:bg-white text-black"
                              >
                                <ExternalLink className="h-4 w-4" />
                                <span className="sr-only">Preview</span>
                              </Button>
                            )}
                            <Button variant="secondary" size="sm" asChild className="bg-white/90 hover:bg-white text-black">
                              <a href={attachment.url} download>
                                <Download className="h-4 w-4" />
                                <span className="sr-only">Download</span>
                              </a>
                            </Button>
                          </div>
                        </div>
                      </div>
                      <div className="p-2 border-t bg-muted/5">
                        <p className="text-sm truncate" title={attachment.caption}>
                          {attachment.caption}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
            <CardFooter>
              <div className="w-full flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`${likedReplies[reply.id] ? "text-primary bg-primary/10 hover:bg-primary/20" : ""} transition-colors`}
                    onClick={() => handleLike(reply.id)}
                  >
                    <ThumbsUp className="mr-1 h-4 w-4" />
                    {reply.likes + (likedReplies[reply.id] ? 1 : 0)} Likes
                  </Button>
                  {level < maxLevel && (
                    <Button variant="ghost" size="sm" onClick={() => onReply(reply.id)}>
                      <Reply className="mr-1 h-4 w-4" />
                      Reply
                    </Button>
                  )}
                </div>
                {reply.replies && reply.replies.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleRepliesExpansion(reply.id)}
                    className={`text-muted-foreground hover:text-primary ml-auto ${expandedReplies[reply.id] ? 'bg-muted/10' : ''}`}
                  >
                    {!expandedReplies[reply.id] ? (
                      <>
                        <ChevronDown className="mr-1 h-4 w-4" />
                        <span className="whitespace-nowrap">
                          Show {reply.replies.length} {reply.replies.length === 1 ? 'reply' : 'replies'}
                        </span>
                      </>
                    ) : (
                      <>
                        <ChevronUp className="mr-1 h-4 w-4" />
                        <span className="whitespace-nowrap">Hide replies</span>
                      </>
                    )}
                  </Button>
                )}
              </div>
            </CardFooter>
          </Card>
          {reply.replies && reply.replies.length > 0 && expandedReplies[reply.id] && (
            <div className="animate-in fade-in slide-in-from-left-1 duration-200 mt-2">
              <ForumReplyList
                replies={reply.replies}
                onReply={onReply}
                onLike={onLike}
                onReport={onReport}
                level={level + 1}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  )
} 
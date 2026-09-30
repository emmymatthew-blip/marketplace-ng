"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search } from "lucide-react"

interface Contact {
  id: string
  name: string
  image?: string
  lastMessage?: string
  unreadCount?: number
  lastActive?: string
}

interface ContactListProps {
  contacts: Contact[]
  selectedContactId: string | null
  onSelectContact: (contactId: string) => void
  isLoading: boolean
}

export function ContactList({ contacts, selectedContactId, onSelectContact, isLoading }: ContactListProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredContacts = contacts.filter((contact) => contact.name.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <div className="flex flex-col h-full">
      <div className="relative mb-4">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search contacts..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center flex-1">
          <p className="text-muted-foreground">Loading contacts...</p>
        </div>
      ) : filteredContacts.length === 0 ? (
        <div className="flex flex-col items-center justify-center flex-1">
          <p className="text-muted-foreground">No contacts found</p>
        </div>
      ) : (
        <ScrollArea className="flex-1">
          <div className="space-y-2">
            {filteredContacts.map((contact) => (
              <Button
                key={contact.id}
                variant="ghost"
                className={`w-full justify-start px-2 ${selectedContactId === contact.id ? "bg-muted" : ""}`}
                onClick={() => onSelectContact(contact.id)}
              >
                <div className="flex items-center gap-3 w-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={contact.image || "/placeholder.svg"} alt={contact.name} />
                    <AvatarFallback>{contact.name.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-start flex-1 overflow-hidden">
                    <span className="font-medium">{contact.name}</span>
                    {contact.lastMessage && (
                      <span className="text-xs text-muted-foreground truncate w-full">{contact.lastMessage}</span>
                    )}
                  </div>
                  {contact.unreadCount && contact.unreadCount > 0 && (
                    <div className="bg-primary text-white text-xs rounded-full h-5 min-w-5 flex items-center justify-center px-1">
                      {contact.unreadCount}
                    </div>
                  )}
                </div>
              </Button>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  )
}

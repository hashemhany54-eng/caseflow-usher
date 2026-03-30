import { useState, useRef, useEffect } from "react";
import { ChatMessage } from "@/types";
import { mockChatMessages } from "@/data/mockData";
import { MessageSquare, Send, Paperclip, X, FileText, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

function formatTime(ts: string) {
  const d = new Date(ts);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

const activityLog = [
  { id: "a1", action: "Removed from On Hold", user: "System", timestamp: new Date(Date.now() - 3600000 * 2).toISOString() },
  { id: "a2", action: "Items Added to Order", user: "Dr. Mark Evans", timestamp: new Date(Date.now() - 3600000 * 5).toISOString() },
  { id: "a3", action: "Item Deleted from Order", user: "Alex Rivera", timestamp: new Date(Date.now() - 3600000 * 8).toISOString() },
  { id: "a4", action: "In House Design Completed", user: "Alex Rivera", timestamp: new Date(Date.now() - 3600000 * 12).toISOString() },
  { id: "a5", action: "Order Assigned to Designer", user: "System", timestamp: new Date(Date.now() - 3600000 * 24).toISOString() },
  { id: "a6", action: "QC Review Passed", user: "QC Team", timestamp: new Date(Date.now() - 3600000 * 30).toISOString() },
];

export function ActivityPanel({ collapsed, onToggle }: { collapsed: boolean; onToggle: () => void }) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>(mockChatMessages["room-1"] || []);
  const scrollRef = useRef<HTMLDivElement>(null);
  const unreadCount = 3;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!message.trim()) return;
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      room_id: "room-1",
      sender_id: "u1",
      sender_name: "Dr. Sarah Chen",
      content: message,
      timestamp: new Date().toISOString(),
      type: "text",
    };
    setMessages((prev) => [...prev, newMsg]);
    setMessage("");
  };

  if (collapsed) {
    return (
      <div className="w-12 border-l bg-card flex flex-col items-center py-3 gap-3 shrink-0">
        <Button variant="ghost" size="icon" className="h-9 w-9 relative" onClick={onToggle}>
          <MessageSquare className="h-5 w-5 text-muted-foreground" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[9px] bg-primary text-primary-foreground">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </div>
    );
  }

  const chatMessages = messages.filter((m) => m.type !== "system");

  return (
    <div className="w-80 border-l bg-card flex flex-col shrink-0 overflow-hidden">
      <div className="h-14 flex items-center justify-between px-3 border-b shrink-0">
        <span className="text-sm font-semibold">Activity</span>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onToggle}>
          <X className="h-4 w-4 text-muted-foreground" />
        </Button>
      </div>

      <Tabs defaultValue="activity" className="flex flex-col flex-1 min-h-0">
        <TabsList className="mx-3 mt-2 h-8 shrink-0 w-[calc(100%-1.5rem)]">
          <TabsTrigger value="activity" className="text-xs h-6 flex-1">Activity</TabsTrigger>
          <TabsTrigger value="chat" className="text-xs h-6 flex-1">Chat</TabsTrigger>
        </TabsList>

        <TabsContent value="activity" className="flex-1 overflow-y-auto m-0 mt-1 p-3 space-y-1">
          {activityLog.map((entry) => (
            <div key={entry.id} className="flex items-start gap-2.5 py-2 border-b border-border/50 last:border-0">
              <div className="mt-0.5 h-6 w-6 rounded-full bg-muted flex items-center justify-center shrink-0">
                <Clock className="h-3 w-3 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium leading-tight">{entry.action}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">{entry.user} • {formatTime(entry.timestamp)}</p>
              </div>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="chat" className="flex-1 flex flex-col min-h-0 m-0 mt-1">
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-3">
            {chatMessages.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
                <MessageSquare className="h-8 w-8 mb-2 opacity-30" />
                <p className="text-xs">No messages yet</p>
              </div>
            ) : (
              chatMessages.map((msg) => (
                <div key={msg.id} className={cn("flex flex-col", msg.sender_id === "u1" ? "items-end" : "items-start")}>
                  <span className="text-[10px] text-muted-foreground mb-0.5">{msg.sender_name}</span>
                  {msg.type === "attachment" ? (
                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary text-xs">
                      <FileText className="h-3.5 w-3.5 text-primary" />
                      <span>{msg.attachment_name}</span>
                    </div>
                  ) : (
                    <div className={cn(
                      "px-3 py-2 rounded-lg text-xs max-w-[220px]",
                      msg.sender_id === "u1" ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground"
                    )}>
                      {msg.content}
                    </div>
                  )}
                  <span className="text-[9px] text-muted-foreground mt-0.5">{formatTime(msg.timestamp)}</span>
                </div>
              ))
            )}
          </div>
          <div className="h-[60px] px-3 border-t shrink-0 flex items-center">
            <div className="flex gap-2 w-full">
              <Button variant="ghost" size="icon" className="h-9 w-9 shrink-0">
                <Paperclip className="h-4 w-4 text-muted-foreground" />
              </Button>
              <Input
                placeholder="Type a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                className="h-9 text-xs bg-secondary border-0"
              />
              <Button size="sm" className="h-9 w-9 p-0 shrink-0" onClick={handleSend} disabled={!message.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

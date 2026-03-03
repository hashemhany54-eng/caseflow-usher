import { useState, useRef, useEffect } from "react";
import { ChatRoom, ChatMessage } from "@/types";
import { mockChatRooms, mockChatMessages } from "@/data/mockData";
import { MessageSquare, Send, Paperclip, X, ChevronRight, FileText, Info } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

function formatTime(ts: string) {
  const d = new Date(ts);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function formatDate(ts: string) {
  const d = new Date(ts);
  const today = new Date();
  if (d.toDateString() === today.toDateString()) return "Today";
  return d.toLocaleDateString([], { month: "short", day: "numeric" });
}

export function ChatPanel({ collapsed, onToggle }: { collapsed: boolean; onToggle: () => void }) {
  const [activeRoom, setActiveRoom] = useState<ChatRoom | null>(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>(mockChatMessages);
  const [showSystemLogs, setShowSystemLogs] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [activeRoom, messages]);

  const handleSend = () => {
    if (!message.trim() || !activeRoom) return;
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      room_id: activeRoom.id,
      sender_id: "u1",
      sender_name: "Dr. Sarah Chen",
      content: message,
      timestamp: new Date().toISOString(),
      type: "text",
    };
    setMessages((prev) => ({
      ...prev,
      [activeRoom.id]: [...(prev[activeRoom.id] || []), newMsg],
    }));
    setMessage("");
  };

  if (collapsed) {
    return (
      <div className="w-12 border-l bg-card flex flex-col items-center py-3 gap-3 shrink-0">
        <button onClick={onToggle} className="p-2 rounded-lg hover:bg-secondary transition-colors relative">
          <MessageSquare className="h-5 w-5 text-muted-foreground" />
          {mockChatRooms.some((r) => r.unread_count > 0) && (
            <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-destructive" />
          )}
        </button>
      </div>
    );
  }

  const roomMessages = activeRoom ? (messages[activeRoom.id] || []) : [];
  const filteredMessages = showSystemLogs ? roomMessages : roomMessages.filter((m) => m.type !== "system");

  return (
    <div className="w-80 border-l bg-card flex flex-col shrink-0">
      {/* Header */}
      <div className="h-14 flex items-center justify-between px-3 border-b shrink-0">
        {activeRoom ? (
          <div className="flex items-center gap-2 min-w-0">
            <button onClick={() => setActiveRoom(null)} className="p-1 hover:bg-secondary rounded transition-colors">
              <ChevronRight className="h-4 w-4 rotate-180 text-muted-foreground" />
            </button>
            <span className="text-sm font-semibold truncate">{activeRoom.name}</span>
          </div>
        ) : (
          <span className="text-sm font-semibold">Chat</span>
        )}
        <button onClick={onToggle} className="p-1.5 hover:bg-secondary rounded transition-colors">
          <X className="h-4 w-4 text-muted-foreground" />
        </button>
      </div>

      {!activeRoom ? (
        /* Room List */
        <ScrollArea className="flex-1">
          <div className="p-2 space-y-1">
            {mockChatRooms.map((room) => (
              <button
                key={room.id}
                onClick={() => setActiveRoom(room)}
                className="w-full text-left p-3 rounded-lg hover:bg-secondary transition-colors"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium truncate">{room.name}</span>
                  {room.unread_count > 0 && (
                    <Badge className="h-5 min-w-5 text-[10px] bg-primary text-primary-foreground justify-center">
                      {room.unread_count}
                    </Badge>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground truncate max-w-[180px]">{room.last_message}</p>
                  {room.last_message_time && (
                    <span className="text-[10px] text-muted-foreground shrink-0 ml-2">
                      {formatDate(room.last_message_time)}
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </ScrollArea>
      ) : (
        /* Chat View */
        <>
          <Tabs defaultValue="chat" className="flex flex-col flex-1 min-h-0">
            <TabsList className="mx-3 mt-2 h-8 shrink-0">
              <TabsTrigger value="chat" className="text-xs h-6">Chat</TabsTrigger>
              <TabsTrigger value="logs" className="text-xs h-6">System Logs</TabsTrigger>
            </TabsList>
            <TabsContent value="chat" className="flex-1 flex flex-col min-h-0 m-0 mt-1">
              <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-3">
                {roomMessages.filter((m) => m.type !== "system").map((msg) => (
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
                ))}
              </div>
              <div className="p-3 border-t shrink-0">
                <div className="flex gap-2">
                  <button className="p-2 hover:bg-secondary rounded transition-colors shrink-0">
                    <Paperclip className="h-4 w-4 text-muted-foreground" />
                  </button>
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
            <TabsContent value="logs" className="flex-1 overflow-y-auto m-0 mt-1 p-3 space-y-2">
              {roomMessages.filter((m) => m.type === "system").length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
                  <Info className="h-8 w-8 mb-2 opacity-30" />
                  <p className="text-xs">No system logs</p>
                </div>
              ) : (
                roomMessages.filter((m) => m.type === "system").map((msg) => (
                  <div key={msg.id} className="px-3 py-2 rounded-lg bg-muted text-xs text-muted-foreground">
                    <p>{msg.content}</p>
                    <span className="text-[9px]">{formatTime(msg.timestamp)}</span>
                  </div>
                ))
              )}
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
}

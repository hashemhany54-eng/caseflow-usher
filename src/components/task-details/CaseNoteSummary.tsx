import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StickyNote, Plus, ChevronDown, ChevronUp } from "lucide-react";

const mockNotes = [
  {
    id: "note-1",
    title: "Physical Waxup 6,7,8,9,10,11",
    content: "Increase VDO 1–2mm. Plan is to extract #7 and create a bridge from 6–8 with individual crowns on 9,10,11.",
    author: "Dr. Mark Evans",
    timestamp: "Dec 31, 6:49 PM",
  },
];

const mockDesignTask = {
  title: "Design Task",
  items: [
    "LSR performed on this order",
    "LSR Reviewed",
    "Distortion / Scan Error (insufficient images / landmarks)",
  ],
  timestamp: "Dec 31, 6:49 PM",
};

export function CaseNoteSummary() {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="rounded-lg border bg-card p-5 mb-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold">Case Note Summary</h2>
          <Badge variant="secondary" className="text-[10px] px-1.5 py-0">{mockNotes.length}</Badge>
        </div>
        <Button variant="outline" size="sm" className="text-xs h-7 gap-1">
          <Plus className="h-3 w-3" /> Add or Edit Note
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {/* Case Notes */}
        <div className="space-y-2">
          {mockNotes.map((note) => (
            <div key={note.id} className="rounded-md border border-warning/20 bg-warning/5 p-3">
              <div className="flex items-start gap-2">
                <StickyNote className="h-3.5 w-3.5 text-warning mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-semibold">{note.title}</p>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{note.content}</p>
                  <p className="text-[10px] text-muted-foreground mt-2">{note.author} • {note.timestamp}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Design Task Ticket */}
        <div className="rounded-md border bg-muted/50 p-3">
          <p className="text-xs font-semibold mb-2">{mockDesignTask.title}</p>
          <ul className="space-y-1">
            {mockDesignTask.items.slice(0, expanded ? undefined : 2).map((item, i) => (
              <li key={i} className="text-xs text-muted-foreground flex items-start gap-1.5">
                <span className="mt-1 h-1 w-1 rounded-full bg-muted-foreground shrink-0" />
                {item}
              </li>
            ))}
          </ul>
          {mockDesignTask.items.length > 2 && (
            <Button
              variant="link"
              size="sm"
              onClick={() => setExpanded(!expanded)}
              className="text-[10px] text-primary font-medium mt-2 h-auto p-0 gap-0.5"
            >
              {expanded ? <><ChevronUp className="h-3 w-3" /> Read Less</> : <><ChevronDown className="h-3 w-3" /> Read More</>}
            </Button>
          )}
          <p className="text-[10px] text-muted-foreground mt-2">{mockDesignTask.timestamp}</p>
        </div>
      </div>
    </div>
  );
}

import { Bookmark, X, Pencil, Check, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import type { Bookmark as BookmarkType } from "@/hooks/useBookmarks";

interface BookmarkSidebarProps {
  open: boolean;
  onClose: () => void;
  bookmarks: BookmarkType[];
  onGoToPage: (page: number) => void;
  onRemove: (id: string) => void;
  onUpdate: (id: string, label: string) => void;
}

export function BookmarkSidebar({
  open,
  onClose,
  bookmarks,
  onGoToPage,
  onRemove,
  onUpdate,
}: BookmarkSidebarProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  const startEdit = (bookmark: BookmarkType) => {
    setEditingId(bookmark.id);
    setEditValue(bookmark.label);
  };

  const saveEdit = () => {
    if (editingId && editValue.trim()) {
      onUpdate(editingId, editValue.trim());
    }
    setEditingId(null);
    setEditValue("");
  };

  const sorted = [...bookmarks].sort((a, b) => a.page - b.page);

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40"
          onClick={onClose}
        />
      )}
      <aside
        className={`fixed top-0 left-0 h-full w-80 max-w-[85vw] bg-card border-r border-gold z-50 transform transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <Bookmark className="h-5 w-5 text-gold" />
            <h2 className="font-heading font-semibold text-lg">Bookmarks</h2>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="overflow-y-auto h-[calc(100%-65px)] p-2">
          {sorted.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Bookmark className="h-10 w-10 mb-3 opacity-40" />
              <p className="text-sm">No bookmarks yet</p>
              <p className="text-xs mt-1">Tap the bookmark icon to save a page</p>
            </div>
          ) : (
            <ul className="space-y-1">
              {sorted.map((b) => (
                <li
                  key={b.id}
                  className="group flex items-center gap-2 rounded-md hover:bg-secondary p-2 cursor-pointer transition-colors"
                >
                  {editingId === b.id ? (
                    <div className="flex items-center gap-1 flex-1">
                      <Input
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && saveEdit()}
                        className="h-7 text-sm bg-background"
                        autoFocus
                      />
                      <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0" onClick={saveEdit}>
                        <Check className="h-3 w-3" />
                      </Button>
                    </div>
                  ) : (
                    <>
                      <div
                        className="flex-1 min-w-0"
                        onClick={() => {
                          onGoToPage(b.page);
                          onClose();
                        }}
                      >
                        <p className="text-sm font-medium truncate">{b.label}</p>
                        <p className="text-xs text-muted-foreground">Page {b.page}</p>
                      </div>
                      <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => startEdit(b)}
                        >
                          <Pencil className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-destructive"
                          onClick={() => onRemove(b.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </aside>
    </>
  );
}

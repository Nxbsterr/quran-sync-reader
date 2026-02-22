import { BookmarkPlus, BookOpen, ChevronLeft, ChevronRight, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface QuranHeaderProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onToggleBookmark: () => void;
  onToggleSidebar: () => void;
  isBookmarked: boolean;
}

export function QuranHeader({
  currentPage,
  totalPages,
  onPageChange,
  onToggleBookmark,
  onToggleSidebar,
  isBookmarked,
}: QuranHeaderProps) {
  const [pageInput, setPageInput] = useState("");

  const handlePageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const page = parseInt(pageInput, 10);
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
      setPageInput("");
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-gold bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="flex items-center justify-between px-4 py-2 max-w-screen-xl mx-auto">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleSidebar}
            className="text-foreground hover:bg-secondary"
          >
            <List className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-1">
            <BookOpen className="h-5 w-5 text-gold" />
            <h1 className="font-heading text-lg font-semibold tracking-tight hidden sm:block">
              القرآن الكريم
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage <= 1}
            className="text-foreground hover:bg-secondary"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <form onSubmit={handlePageSubmit} className="flex items-center gap-1">
            <Input
              type="number"
              min={1}
              max={totalPages}
              value={pageInput}
              onChange={(e) => setPageInput(e.target.value)}
              placeholder={String(currentPage)}
              className="w-16 h-8 text-center text-sm bg-secondary border-border"
            />
            <span className="text-sm text-muted-foreground">/ {totalPages}</span>
          </form>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage >= totalPages}
            className="text-foreground hover:bg-secondary"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleBookmark}
          className={isBookmarked ? "text-gold hover:bg-secondary" : "text-muted-foreground hover:bg-secondary"}
        >
          <BookmarkPlus className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
}

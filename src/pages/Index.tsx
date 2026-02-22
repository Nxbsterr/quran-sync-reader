import { useState, useCallback, useEffect } from "react";
import { useBookmarks } from "@/hooks/useBookmarks";
import { useLastPage } from "@/hooks/useLastPage";
import { QuranHeader } from "@/components/QuranHeader";
import { BookmarkSidebar } from "@/components/BookmarkSidebar";
import { PdfViewer } from "@/components/PdfViewer";
import { toast } from "sonner";
import { BookOpen, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Capacitor } from '@capacitor/core';

const Index = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [loadingPdf, setLoadingPdf] = useState(true);
  const [totalPages, setTotalPages] = useState(604);
  const [currentPage, setCurrentPage] = useLastPage();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [immersive, setImmersive] = useState(false);
  const { bookmarks, addBookmark, removeBookmark, updateBookmark, isBookmarked } = useBookmarks();

  // Fetch PDF URL
  // Fetch PDF URL (Offline-Friendly Version)
  useEffect(() => {
    // Instead of a plain string, we convert the local path to a Capacitor-friendly URL
    const isNative = Capacitor.isNativePlatform();
    const localUrl = isNative
      ? Capacitor.convertFileSrc("Quraan.pdf")
      : "/Quraan.pdf";
    setPdfUrl(localUrl);
    setLoadingPdf(false);
  }, []);

  // Splash screen timer
  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  const handleToggleBookmark = useCallback(() => {
    const existing = bookmarks.find((b) => b.page === currentPage);
    if (existing) {
      removeBookmark(existing.id);
      toast("Bookmark removed", { duration: 2500 });
    } else {
      addBookmark(currentPage);
      toast("Page bookmarked", { duration: 2500 });
    }
  }, [bookmarks, currentPage, addBookmark, removeBookmark]);

  const handlePageChange = useCallback(
    (page: number) => {
      setCurrentPage(page);
    },
    [setCurrentPage]
  );

  if (showSplash) {
    return (
      <div className="fixed inset-0 bg-background islamic-pattern flex items-center justify-center z-50">
        <div className="text-center animate-fade-in">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-primary/10 mb-6 animate-pulse">
            <BookOpen className="h-12 w-12 text-gold" />
          </div>
          <h1 className="font-arabic text-5xl font-bold mb-3 text-foreground">
            القرآن الكريم
          </h1>
          <p className="font-heading text-xl text-gold tracking-widest uppercase">
            The Holy Quran
          </p>
          <div className="mt-8 flex justify-center">
            <div className="w-12 h-0.5 gold-gradient rounded-full animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background islamic-pattern">
      <div className={`transition-all duration-300 ${immersive ? 'opacity-0 pointer-events-none -translate-y-full absolute w-full' : 'opacity-100'}`}>
      <QuranHeader
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        onToggleBookmark={handleToggleBookmark}
        onToggleSidebar={() => setSidebarOpen(true)}
        isBookmarked={isBookmarked(currentPage)}
      />
      </div>

      <BookmarkSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        bookmarks={bookmarks}
        onGoToPage={handlePageChange}
        onRemove={removeBookmark}
        onUpdate={updateBookmark}
      />

      <main className="max-w-screen-xl mx-auto">
        {loadingPdf ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-gold" />
            <p className="text-muted-foreground text-sm font-heading">
              Preparing the Holy Quran...
            </p>
            <p className="text-muted-foreground text-xs">
              This may take a moment on first load
            </p>
          </div>
        ) : pdfUrl ? (
          <PdfViewer
            fileUrl={pdfUrl}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            onTotalPages={setTotalPages}
            onToggleImmersive={() => setImmersive((v) => !v)}
          />
        ) : (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-center px-4">
            <p className="text-destructive font-heading font-semibold">Unable to load the Quran PDF</p>
            <p className="text-muted-foreground text-sm">Please check your connection and refresh.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;

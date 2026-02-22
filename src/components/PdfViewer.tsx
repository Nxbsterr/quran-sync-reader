import { useState, useCallback, useRef } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import { Loader2 } from "lucide-react";

pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

interface PdfViewerProps {
  fileUrl: string;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onTotalPages: (total: number) => void;
  onToggleImmersive?: () => void;
}

export function PdfViewer({ fileUrl, currentPage, totalPages, onPageChange, onTotalPages, onToggleImmersive }: PdfViewerProps) {
  const [loading, setLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef(0);

  const onLoadSuccess = useCallback(
    ({ numPages }: { numPages: number }) => {
      onTotalPages(numPages);
      setLoading(false);
    },
    [onTotalPages]
  );

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    const threshold = 50;
    if (deltaX < -threshold && currentPage < totalPages) {
      onPageChange(currentPage + 1);
    } else if (deltaX > threshold && currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;

    // Middle zone toggles immersive mode
    if (clickX >= width * 0.3 && clickX <= width * 0.7) {
      onToggleImmersive?.();
      return;
    }

    if (clickX < width * 0.3 && currentPage > 1) {
      onPageChange(currentPage - 1);
    } else if (clickX > width * 0.7 && currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div
      ref={containerRef}
      className="flex justify-center py-4 px-2 min-h-[60vh] cursor-pointer select-none overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onClick={handleClick}
    >
      <Document
        file={fileUrl}
        onLoadSuccess={onLoadSuccess}
        loading={
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-gold" />
            <p className="text-muted-foreground text-sm font-heading">Loading the Holy Quran...</p>
          </div>
        }
        error={
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-center px-4">
            <p className="text-destructive font-heading font-semibold">Unable to load PDF</p>
            <p className="text-muted-foreground text-sm max-w-md">
              There was an issue loading the Quran PDF. Please check your connection and try again.
            </p>
          </div>
        }
      >
        {!loading && (
          <Page
            pageNumber={currentPage}
            className="shadow-lg rounded-sm overflow-hidden"
            width={Math.min(window.innerWidth - 32, 700)}
            loading={
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-6 w-6 animate-spin text-gold" />
              </div>
            }
          />
        )}
      </Document>
    </div>
  );
}

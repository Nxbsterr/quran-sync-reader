import { useState, useEffect } from "react";

const KEY = "quran-last-page";

export function useLastPage() {
  const [lastPage, setLastPage] = useState<number>(() => {
    const stored = localStorage.getItem(KEY);
    return stored ? parseInt(stored, 10) : 1;
  });

  useEffect(() => {
    localStorage.setItem(KEY, String(lastPage));
  }, [lastPage]);

  return [lastPage, setLastPage] as const;
}

import { useState, useEffect, useCallback } from "react";

export interface Bookmark {
  id: string;
  page: number;
  label: string;
  createdAt: number;
}

const STORAGE_KEY = "quran-bookmarks";

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
  }, [bookmarks]);

  const addBookmark = useCallback((page: number, label?: string) => {
    const bookmark: Bookmark = {
      id: crypto.randomUUID(),
      page,
      label: label || `Page ${page}`,
      createdAt: Date.now(),
    };
    setBookmarks((prev) => [...prev, bookmark]);
    return bookmark;
  }, []);

  const removeBookmark = useCallback((id: string) => {
    setBookmarks((prev) => prev.filter((b) => b.id !== id));
  }, []);

  const updateBookmark = useCallback((id: string, label: string) => {
    setBookmarks((prev) =>
      prev.map((b) => (b.id === id ? { ...b, label } : b))
    );
  }, []);

  const isBookmarked = useCallback(
    (page: number) => bookmarks.some((b) => b.page === page),
    [bookmarks]
  );

  return { bookmarks, addBookmark, removeBookmark, updateBookmark, isBookmarked };
}

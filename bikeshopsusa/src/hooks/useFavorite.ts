"use client";
// src/hooks/useFavorite.ts
import { useState, useEffect, useCallback } from "react";

function getSessionId(): string {
  if (typeof window === "undefined") return "";
  let id = localStorage.getItem("bsusa_session");
  if (!id) {
    id = Math.random().toString(36).substring(2) + Date.now().toString(36);
    localStorage.setItem("bsusa_session", id);
  }
  return id;
}

export function useFavorite(shopId: string) {
  const [favorited, setFavorited] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const sessionId = getSessionId();
    if (!sessionId) return;
    const stored = localStorage.getItem(`fav_${shopId}`);
    setFavorited(stored === "true");
  }, [shopId]);

  const toggle = useCallback(async () => {
    if (loading) return;
    setLoading(true);
    const sessionId = getSessionId();

    try {
      const res = await fetch("/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shopId, sessionId }),
      });
      const data = await res.json();
      setFavorited(data.favorited);
      localStorage.setItem(`fav_${shopId}`, String(data.favorited));
    } catch (err) {
      console.error("Failed to toggle favorite", err);
    } finally {
      setLoading(false);
    }
  }, [shopId, loading]);

  return { favorited, toggle, loading };
}

// src/components/QuotePopup.tsx
import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { mentalHealthQuotes } from "@/data/quotes";

const INTERVAL_MS = 10 * 60 * 1000; // 10 minutes
const VISIBLE_MS = 5 * 1000; // 5 seconds

const QuotePopup: React.FC = () => {
  const location = useLocation();
  const [visible, setVisible] = useState(false);
  const [quote, setQuote] = useState<string>("");
  const intervalRef = useRef<number | null>(null);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    // Don't show on chat page
    if (location.pathname === "/chat") return;

    // Show a quote
    const showOne = () => {
      const q = mentalHealthQuotes[Math.floor(Math.random() * mentalHealthQuotes.length)];
      setQuote(q);
      setVisible(true);

      // hide after VISIBLE_MS
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
      timeoutRef.current = window.setTimeout(() => {
        setVisible(false);
      }, VISIBLE_MS);
    };

    // Start interval
    // NOTE: For immediate testing you can call showOne() here once.
    intervalRef.current = window.setInterval(showOne, INTERVAL_MS);

    // cleanup
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    };
  }, [location.pathname]);

  // If we're on chat page, or not currently visible, render nothing
  if (location.pathname === "/chat") return null;
  if (!visible) return null;

  return (
    <div
      aria-live="polite"
      className="fixed bottom-6 right-6 z-50 w-80 max-w-xs rounded-2xl p-4 shadow-lg border border-border/30 bg-white/90 backdrop-blur-sm text-sm text-muted-foreground animate-quote"
    >
      <div className="flex items-start space-x-3">
        <div className="flex-none">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-sunshine flex items-center justify-center text-white shadow-sm">
            💚
          </div>
        </div>

        <div className="flex-1">
          <p className="italic leading-snug">“{quote}”</p>
        </div>
      </div>
    </div>
  );
};

export default QuotePopup;

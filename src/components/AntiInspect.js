"use client";

import { useEffect } from "react";

export default function AntiInspect() {
  useEffect(() => {
    // Mencegah Klik Kanan
    const handleContextMenu = (e) => {
      e.preventDefault();
    };

    // Mencegah Shortcut Keyboard
    const handleKeyDown = (e) => {
      // F12
      if (e.key === "F12") {
        e.preventDefault();
      }
      
      // Ctrl+Shift+I atau Cmd+Option+I (Inspect)
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === "i") {
        e.preventDefault();
      }
      
      // Ctrl+Shift+J atau Cmd+Option+J (Console)
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === "j") {
        e.preventDefault();
      }
      
      // Ctrl+Shift+C atau Cmd+Option+C (Inspect Element)
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === "c") {
        e.preventDefault();
      }
      
      // Ctrl+U atau Cmd+U (View Source)
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "u") {
        e.preventDefault();
      }
    };
    
    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("keydown", handleKeyDown);
    
    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return null;
}

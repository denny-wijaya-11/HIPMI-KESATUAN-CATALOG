'use client';

import { useEffect } from 'react';

export default function OnlineTracker() {
  useEffect(() => {

    const pingServer = async () => {
      try {
        await fetch('/api/user/ping', { method: 'POST' });
      } catch (err) {
        // fail silently
      }
    };

    // Ping immediately on mount
    pingServer();

    // Ping every 30 seconds
    const interval = setInterval(pingServer, 30000);

    // Also ping when window gets focus
    const handleFocus = () => pingServer();
    window.addEventListener('focus', handleFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  return null; // This component doesn't render anything
}

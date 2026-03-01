'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

function getVisitorId(): string {
  if (typeof window === 'undefined') return '';
  let id = localStorage.getItem('iranews_vid');
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem('iranews_vid', id);
  }
  return id;
}

export default function VisitorHeartbeat() {
  const pathname = usePathname();

  useEffect(() => {
    const visitorId = getVisitorId();
    if (!visitorId) return;

    const send = () => {
      fetch('/api/analytics/heartbeat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          visitorId,
          page: pathname,
          referrer: document.referrer || undefined,
        }),
      }).catch(() => {});
    };

    // Send immediately on page load / navigation
    send();

    // Then every 15 seconds
    const interval = setInterval(send, 15_000);

    return () => clearInterval(interval);
  }, [pathname]);

  return null;
}

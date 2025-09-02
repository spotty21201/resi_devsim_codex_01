"use client";
import React from 'react';

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: 'Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif', margin: 0 }}>
        <div style={{ maxWidth: 900, margin: '40px auto', padding: 16 }}>
          <div style={{ border: '1px solid #ef4444', background: '#fef2f2', padding: 16, borderRadius: 8 }}>
            <h2 style={{ marginTop: 0, color: '#b91c1c' }}>Application Error</h2>
            <p style={{ color: '#7f1d1d' }}>{error?.message || 'Unknown error.'}{error?.digest ? ` (ref: ${error.digest})` : ''}</p>
            <button onClick={() => reset()} style={{ padding: '6px 10px' }}>Reload</button>
          </div>
        </div>
      </body>
    </html>
  );
}


"use client";
import React from 'react';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div style={{ border: '1px solid #ef4444', background: '#fef2f2', padding: 16, borderRadius: 8 }}>
      <h3 style={{ marginTop: 0, color: '#b91c1c' }}>Something went wrong</h3>
      <div style={{ color: '#7f1d1d', fontSize: 14 }}>
        {error?.message || 'Unknown error.'}
        {error?.digest ? ` (ref: ${error.digest})` : null}
      </div>
      <div style={{ marginTop: 12 }}>
        <button onClick={() => reset()} style={{ padding: '6px 10px' }}>Try again</button>
      </div>
    </div>
  );
}


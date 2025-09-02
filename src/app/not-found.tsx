import React from 'react';

export default function NotFound() {
  return (
    <div style={{ border: '1px solid #000', padding: 16, borderRadius: 8 }}>
      <h3 style={{ marginTop: 0 }}>Page Not Found</h3>
      <p>Sorry, we couldn’t find that page.</p>
      <a href="/">Go back home</a>
    </div>
  );
}


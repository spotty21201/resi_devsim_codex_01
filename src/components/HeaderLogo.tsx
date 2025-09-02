"use client";
import React from 'react';

export function HeaderLogo({ width = 180 }: { width?: number }) {
  const [src, setSrc] = React.useState<string>('/kolabs-logo-black.png');
  const [failed, setFailed] = React.useState<boolean>(false);

  return failed ? (
    <div style={{ color: '#6b7280', fontSize: 14 }}>Kolabs.Design</div>
  ) : (
    <img
      className="app-logo"
      src={src}
      alt="Kolabs.Design"
      width={width}
      height={Math.round(width * 0.28)}
      onError={() => {
        if (src !== '/kolabs-logo-white.png') {
          setSrc('/kolabs-logo-white.png');
        } else {
          setFailed(true);
        }
      }}
      style={{ objectFit: 'contain' }}
    />
  );
}


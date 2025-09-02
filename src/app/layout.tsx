import React from 'react';
import type { ReactNode } from 'react';
import './globals.css';
import { HeaderLogo } from '../components/HeaderLogo';

export const metadata = {
  title: 'Residential Master Planning Simulator',
  description: 'Think like a designer. Plan like a developer.'
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body style={{
        margin: 0,
        fontFamily: 'Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif',
        color: '#111',
        background: '#fff'
      }}>
        <header className="app-header">
          <div className="app-title-wrap">
            <div className="app-title-line">
              <strong className="app-title">Residential Master Planning Simulator</strong>
              <span className="app-byline">v0.9 by Kolabs.Design × HDA × AIM</span>
            </div>
            <div className="app-tagline">Predictive design and yield analysis for residential master planners.</div>
          </div>
          <HeaderLogo width={180} />
        </header>
        <main style={{ padding: '24px', maxWidth: 1200, margin: '0 auto' }}>{children}</main>
      </body>
    </html>
  );
}

// Branding moved to client component in ../components/Branding

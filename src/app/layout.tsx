import React from 'react';
import './globals.css';
import { AuthProvider } from '../lib/auth-context';

export const metadata = {
  title: 'StudyPilot AI — Intelligent Personal Tutor & Exam Prep Coach',
  description: 'Affordable, offline-first personal learning companion for students in low-resource environments.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/logo.png" />
        <meta name="theme-color" content="#0f172a" />
      </head>
      <body className="antialiased">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}

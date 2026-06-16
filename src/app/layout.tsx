import React from 'react';
import './globals.css';

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
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}

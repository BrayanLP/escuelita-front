// app/panel/layout.tsx
"use client";

export default function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="min-h-screen flex flex-col bg-muted">{children}</div>;
}

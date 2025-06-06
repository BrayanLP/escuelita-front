// app/panel/layout.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MainNavbar } from "@/components/main-navbar";
import { CommunitySidebar } from "@/components/community-sidebar";
import { supabase } from "@/lib/supabase/client";

export default function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  return <div className="min-h-screen flex flex-col bg-muted">{children}</div>;
}

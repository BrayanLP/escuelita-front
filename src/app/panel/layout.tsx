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

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        router.push("/login");
      } else {
        setLoading(false);
      }
    });
  }, []);

  if (loading) return null;

  return (
    <div className="min-h-screen flex flex-col bg-muted">
      <MainNavbar />
      <div className="flex flex-1 max-w-7xl mx-auto w-full px-4 py-6 gap-6">
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}

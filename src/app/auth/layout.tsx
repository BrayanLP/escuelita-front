"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MainNavbar } from "@/components/main-navbar";
import { supabase } from "@/lib/supabase/client";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(true);
  const [authed, setAuthed] = useState(false);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        router.push("/auth/login");
      } else {
        setAuthed(true);
      }
      setLoading(false);
    });
  }, []);

  if (loading) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <MainNavbar />
      <main className="flex-1 bg-muted p-4">{children}</main>
    </div>
  );
}

// app/community/[communityId]/layout.tsx
"use client";

import { use, useEffect, useState } from "react";
import { CommunityProvider, useCommunity } from "@/context/community-context";
import { useRouter, usePathname } from "next/navigation";
import { MainNavbar } from "@/components/main-navbar";

function ProtectedLayout({
  children,
  slug,
}: {
  children: React.ReactNode;
  slug: string;
}) {
  const { loading, community, existCommunity, exitsUserPermission } =
    useCommunity();

  const router = useRouter();
  const pathname = usePathname();

  const [redirected, setRedirected] = useState(false);

  useEffect(() => {
    if (loading) return;

    const isAboutPage = pathname.endsWith("/about");

    // Redirigir si la comunidad no existe
    if (!existCommunity) {
      router.push("/");
      setRedirected(true);
      return;
    }

    // Redirigir si no tiene permiso y no está en /about
    if (!exitsUserPermission && !isAboutPage) {
      router.push(`/community/${slug}/about`);
      setRedirected(true);
      return;
    }
  }, [loading, existCommunity, exitsUserPermission, pathname]);

  if (loading || redirected) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-muted-foreground">Cargando comunidad ...</p>
      </div>
    );
  }

  return <>{children}</>;
}

export default function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ communityId: string }>;
}) {
  const { communityId } = use(params);

  return (
    <>
      <CommunityProvider slug={communityId}>
        <MainNavbar />
        <div className="flex-1">
          <ProtectedLayout slug={communityId}>{children}</ProtectedLayout>
        </div>
      </CommunityProvider>
    </>
  );
}

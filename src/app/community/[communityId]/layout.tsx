// app/community/[communityId]/layout.tsx
"use client";

import { use } from "react";
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

  console.log(
    "existCommunity, exitsUserPermission",
    existCommunity,
    exitsUserPermission,
    loading
  );
  if (loading === true) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-muted-foreground">Cargando comunidad ...</p>
      </div>
    );
  }

  if (!loading && !existCommunity) {
    router.push("/");
    return null;
  }

  const isAboutPage = pathname.endsWith("/about");

  if (!exitsUserPermission && !isAboutPage) {
    router.push(`/community/${slug}/about`);
    return null;
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

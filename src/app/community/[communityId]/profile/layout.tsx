// app/community/[communityId]/profile/layout.tsx
"use client";

import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { useCommunity } from "@/context/community-context";

const tabs = [
  { label: "Mi cuenta", segment: "account" },
  { label: "Suscripciones", segment: "subscriptions" },
  { label: "Miembros", segment: "members" },
  { label: "Comunidades", segment: "communities" },
  { label: "Pagos", segment: "billing" },
  { label: "Metodos de Pagos", segment: "payment-methods" },
  { label: "Preferencias", segment: "settings" },
];

export default function CommunityProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { communityId } = useParams();
  const {  exitsUserPermission } =
    useCommunity();
  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">Mi perfil en la comunidad</h1>
      <div className="flex gap-3 border-b mb-6 overflow-x-auto">
        {exitsUserPermission && tabs.map((tab) => {
          const href = `/community/${communityId}/profile/${tab.segment}`;
          return (
            <Link
              key={tab.segment}
              href={href}
              className={cn(
                "px-3 py-2 text-sm font-medium whitespace-nowrap",
                pathname === href
                  ? "border-b-2 border-primary text-primary"
                  : "text-muted-foreground"
              )}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>
      {children}
    </div>
  );
}

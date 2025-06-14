"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";
import { useCommunity } from "@/context/community-context";
import { useAuth } from "@/context/auth-provider";

const tabs = (id: string) => [
  { label: "Community", href: "/community/" + id },
  { label: "Classroom", href: "/community/" + id + "/classroom" },
  { label: "Calendar", href: "/community/" + id + "/calendar" },
  { label: "Members", href: "/community/" + id + "/members" },
  { label: "About", href: "/community/" + id + "/about" },
];

export function MainNavbar() {
  const pathname = usePathname();
  const { communityId } = useParams();
  const { exitsUserPermission, loading } = useCommunity();
  const { user } = useAuth();
  return (
    <header className="flex items-center justify-between px-6 py-4 border-b bg-white">
      <div className="flex items-center gap-4">
        <Link href="/" className="font-bold text-xl">
          Escuelita
        </Link>
        <nav className="hidden md:flex gap-3 text-sm">
          {exitsUserPermission &&
            tabs(communityId).map((tab) => (
              <Link
                key={tab.href}
                href={tab.href}
                className={`px-3 py-1 rounded-md hover:bg-muted transition ${
                  pathname === tab.href ? "bg-muted font-semibold" : ""
                }`}
              >
                {tab.label}
              </Link>
            ))}
        </nav>
      </div>
      {!loading && (
        <>
          {exitsUserPermission || user?.id ? (
            <Button variant="outline" size="sm">
              <Link href={"/community/" + communityId + "/profile"}>
                PERFIL
              </Link>
            </Button>
          ) : (
            <Button variant="outline" size="sm">
              <Link href={"/auth/login"}>LOG IN</Link>
            </Button>
          )}
        </>
      )}
    </header>
  );
}

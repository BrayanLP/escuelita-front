"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

const tabs = [
  { label: "Community", href: "/panel" },
  { label: "Classroom", href: "/panel/classroom" },
  { label: "Calendar", href: "/panel/calendar" },
  { label: "Members", href: "/panel/members" },
  { label: "About", href: "/panel/about" },
];

export function MainNavbar() {
  const pathname = usePathname();

  return (
    <header className="flex items-center justify-between px-6 py-4 border-b bg-white">
      <div className="flex items-center gap-4">
        <Link href="/panel" className="font-bold text-xl">
          Escuelita
        </Link>
        <nav className="hidden md:flex gap-3 text-sm">
          {tabs.map((tab) => (
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
      <Button variant="outline" size="sm">
        Perfil
      </Button>
    </header>
  );
}

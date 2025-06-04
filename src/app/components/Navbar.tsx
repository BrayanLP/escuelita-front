"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Menu, LogOut, UserCircle, LogInIcon, UserPlus } from "lucide-react";
import { EscuelitaLogo } from "./Icons";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/auth-provider";
const baseNavLinks = [
  { href: "/", label: "Cursos" },
  { href: "/community", label: "Comunidad" },
  { href: "/calendar", label: "Calendario" },
  { href: "/members", label: "Miembros" },
];

export function Navbar() {
  const pathname = usePathname();
  // Simular estado de usuario y carga sin Firebase
  const user = null; // O un objeto de usuario si quieres simular un usuario logeado
  const loading = false; // O true si quieres simular carga

  const dynamicNavLinks = user
    ? [...baseNavLinks, { href: `/profile/${user.uid}`, label: "Perfil" }]
    : baseNavLinks;

  return (
    <header className="bg-card border-b border-border sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 text-primary hover:text-primary/90 transition-colors"
        >
          <EscuelitaLogo className="h-7 w-7" />
          <span className="text-xl font-headline font-semibold">Escuelita</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {dynamicNavLinks.map((link) => (
            <Button
              key={link.href}
              variant="ghost"
              asChild
              className={cn(
                "text-sm text-foreground/70 hover:text-foreground hover:bg-accent/50",
                pathname === link.href
                  ? "text-primary font-semibold bg-accent/30"
                  : pathname.startsWith(link.href) && link.href !== "/"
                  ? "text-primary font-medium bg-accent/20"
                  : ""
              )}
            >
              <Link href={link.href}>{link.label}</Link>
            </Button>
          ))}
          {!loading &&
            !user && ( // Mantener botones de login/signup si no hay usuario
              <>
                <Button
                  variant="ghost"
                  asChild
                  className="text-sm text-foreground/70 hover:text-foreground hover:bg-accent/50"
                >
                  <Link href="/auth/login">
                    <LogInIcon className="mr-1.5 h-4 w-4" /> Login
                  </Link>
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  asChild
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  <Link href="/auth/signup">
                    <UserPlus className="mr-1.5 h-4 w-4" /> Sign Up
                  </Link>
                </Button>
              </>
            )}
          {/* Eliminar el botón de Logout que usaba Firebase */}
          {/* {!loading && user && (
            <Button variant="ghost" onClick={handleSignOut} className="text-sm text-foreground/70 hover:text-destructive hover:bg-destructive/10">
              <LogOut className="mr-1.5 h-4 w-4" /> Logout
            </Button>
          )}
          */}
        </nav>
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Abrir menú</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] sm:w-[320px] p-0">
              <div className="flex flex-col h-full">
                <div className="p-4 border-b">
                  <Link
                    href="/"
                    className="flex items-center gap-2 text-primary"
                  >
                    <EscuelitaLogo className="h-8 w-8" />
                    <span className="text-2xl font-headline font-semibold">
                      Escuelita
                    </span>
                  </Link>
                </div>
                <nav className="flex-grow py-4 px-2 space-y-1">
                  {dynamicNavLinks.map((link) => (
                    <SheetClose asChild key={link.href}>
                      <Button
                        variant="ghost"
                        asChild
                        className={cn(
                          "justify-start text-base py-3 px-3 h-auto w-full",
                          pathname === link.href
                            ? "text-primary font-semibold bg-accent"
                            : pathname.startsWith(link.href) &&
                              link.href !== "/"
                            ? "text-primary bg-accent/80"
                            : "text-foreground/80"
                        )}
                      >
                        <Link href={link.href}>{link.label}</Link>
                      </Button>
                    </SheetClose>
                  ))}
                </nav>
                <div className="p-4 border-t mt-auto">
                  {!loading && !user && (
                    <div className="space-y-2">
                      <SheetClose asChild>
                        <Button variant="outline" asChild className="w-full">
                          <Link href="/auth/login">
                            <LogInIcon className="mr-2" />
                            Login
                          </Link>
                        </Button>
                      </SheetClose>
                      <SheetClose asChild>
                        <Button
                          variant="default"
                          asChild
                          className="w-full bg-primary hover:bg-primary/90"
                        >
                          <Link href="/auth/signup">
                            <UserPlus className="mr-2" />
                            Sign Up
                          </Link>
                        </Button>
                      </SheetClose>
                    </div>
                  )}
                  {/* Eliminar el botón de Logout en el menú móvil */}
                  {/* {!loading && user && (
                     <SheetClose asChild>
                        <Button variant="outline" onClick={handleSignOut} className="w-full">
                          <LogOut className="mr-2" /> Logout
                        </Button>
                      </SheetClose>
                  )}*/}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

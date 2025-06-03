
'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import { EscuelitaLogo } from './Icons';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/', label: 'Cursos' },
  { href: '/community', label: 'Comunidad' },
  { href: '/calendar', label: 'Calendario' },
  { href: '/members', label: 'Miembros' },
  // { href: '/community/about', label: 'Acerca de' }, // "Acerca de" can be linked from the Community page
  // Keeping profile link for now, can be changed to dynamic later
  { href: '/profile/user1', label: 'Perfil' }, 
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="bg-card border-b border-border sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-primary hover:text-primary/90 transition-colors">
          <EscuelitaLogo className="h-7 w-7" />
          <span className="text-xl font-headline font-semibold">Escuelita</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Button key={link.href} variant="ghost" asChild
              className={cn(
                "text-sm text-foreground/70 hover:text-foreground hover:bg-accent/50",
                pathname === link.href ? "text-primary font-semibold bg-accent/30" : 
                (pathname.startsWith(link.href) && link.href !== '/') ? "text-primary font-medium bg-accent/20" : ""
              )}
            >
              <Link href={link.href}>{link.label}</Link>
            </Button>
          ))}
        </nav>

        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Abrir menú</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] sm:w-[320px]">
              <div className="flex flex-col gap-2 py-6">
                <Link href="/" className="flex items-center gap-2 text-primary mb-4 px-3">
                  <EscuelitaLogo className="h-8 w-8" />
                  <span className="text-2xl font-headline font-semibold">Escuelita</span>
                </Link>
                {navLinks.map((link) => (
                  <Button
                    key={link.href}
                    variant="ghost"
                    asChild
                    className={cn(
                      "justify-start text-base py-3 px-3 h-auto",
                       pathname === link.href ? "text-primary font-semibold bg-accent" : 
                       (pathname.startsWith(link.href) && link.href !== '/') ? "text-primary bg-accent/80" : "text-foreground/80"
                    )}
                  >
                    <Link href={link.href}>{link.label}</Link>
                  </Button>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, UserCircle } from 'lucide-react';
import { EscuelitaLogo } from './Icons';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/', label: 'Courses' },
  { href: '/profile/user1', label: 'Profile' }, // Placeholder user ID
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

        <nav className="hidden md:flex items-center gap-2">
          {navLinks.map((link) => (
            <Button key={link.href} variant="ghost" asChild
              className={cn(
                "text-foreground/70 hover:text-foreground",
                pathname === link.href && "text-primary font-semibold"
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
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex flex-col gap-4 py-6">
                <Link href="/" className="flex items-center gap-2 text-primary mb-4 px-2">
                  <EscuelitaLogo className="h-7 w-7" />
                  <span className="text-xl font-headline font-semibold">Escuelita</span>
                </Link>
                {navLinks.map((link) => (
                  <Button
                    key={link.href}
                    variant="ghost"
                    asChild
                    className={cn(
                      "justify-start text-lg",
                      pathname === link.href && "text-primary bg-accent"
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

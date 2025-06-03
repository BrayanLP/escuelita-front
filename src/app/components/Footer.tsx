export function Footer() {
  return (
    <footer className="bg-muted/50 border-t border-border py-8 text-center text-sm text-muted-foreground">
      <div className="container mx-auto px-4">
        <p>&copy; {new Date().getFullYear()} Escuelita. All rights reserved.</p>
        <p className="mt-1">Empowering learning communities.</p>
      </div>
    </footer>
  );
}

export function Footer() {
  return (
    <footer className="bg-muted/50 border-t border-border py-8 text-center text-sm text-muted-foreground">
      <div className="container mx-auto px-4">
        <p>
          &copy; {new Date().getFullYear()} Escuelita.lat Todos los derechos
          reservados.
        </p>
        <p className="mt-1">Empoderando comunidades de aprendizaje.</p>
      </div>
    </footer>
  );
}

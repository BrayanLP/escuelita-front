
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Users, Info, Calendar as CalendarIcon, MessageSquare } from 'lucide-react';

export default function CommunityPage() {
  return (
    <div className="space-y-8">
      <section className="text-center py-8 bg-muted/30 rounded-lg">
        <h1 className="text-4xl font-headline font-bold mb-3 text-primary">Bienvenido a Nuestra Comunidad</h1>
        <p className="text-xl text-foreground/80 max-w-3xl mx-auto">
          Un espacio para conectar, aprender y crecer juntos. Explora lo que nuestra comunidad tiene para ofrecer.
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-headline text-xl">
              <Info className="w-6 h-6 text-primary" />
              Acerca de Nosotros
            </CardTitle>
            <CardDescription>Descubre nuestra misión, visión y los valores que nos unen.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4 text-sm">
              Conoce más sobre el propósito de nuestra comunidad y cómo puedes ser parte de ella.
            </p>
            <Button asChild variant="outline" className="w-full">
              <Link href="/community/about">Leer Más</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-headline text-xl">
              <Users className="w-6 h-6 text-primary" />
              Miembros
            </CardTitle>
            <CardDescription>Conecta con otros miembros y expande tu red.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4 text-sm">
              Explora los perfiles de quienes forman parte de esta vibrante comunidad.
            </p>
            <Button asChild variant="outline" className="w-full">
              <Link href="/members">Ver Miembros</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-headline text-xl">
              <MessageSquare className="w-6 h-6 text-primary" />
              Foros de Discusión
            </CardTitle>
            <CardDescription>Participa, pregunta y comparte tus conocimientos.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4 text-sm">
              Únete a las conversaciones en nuestros foros. (Próximamente funcionalidad de foro general)
            </p>
            {/* You might link to a specific course's forum or a future general forum page */}
            <Button asChild variant="outline" className="w-full" disabled>
              <Link href="#">Ir a Foros</Link>
            </Button>
          </CardContent>
        </Card>

         <Card className="shadow-md hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-headline text-xl">
              <CalendarIcon className="w-6 h-6 text-primary" />
              Calendario de Eventos
            </CardTitle>
            <CardDescription>No te pierdas nuestros próximos eventos y talleres.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4 text-sm">
              Consulta el calendario para ver las actividades programadas.
            </p>
            <Button asChild variant="outline" className="w-full">
              <Link href="/calendar">Ver Calendario</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

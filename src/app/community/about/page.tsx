
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, Handshake, Users, Target, BookOpen, Lightbulb } from 'lucide-react';

export default function AboutCommunityPage() {
  return (
    <div className="space-y-8">
      <div className="flex justify-start">
        <Button variant="outline" asChild>
          <Link href="/community">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a Comunidad
          </Link>
        </Button>
      </div>

      <Card className="shadow-xl overflow-hidden">
        <div className="relative h-72 w-full group">
          <Image 
            src="https://placehold.co/1200x450.png" 
            alt="Banner de la Comunidad Escuelita" 
            layout="fill" 
            objectFit="cover"
            data-ai-hint="diverse people collaborating"
            className="transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col items-center justify-center text-center p-4">
            <h1 className="text-5xl md:text-6xl font-headline font-bold text-white drop-shadow-lg">
              Acerca de Escuelita
            </h1>
            <p className="text-xl text-slate-200 mt-2 max-w-2xl drop-shadow-md">
              Donde el aprendizaje y la colaboración se encuentran.
            </p>
          </div>
        </div>
        <CardContent className="p-6 md:p-10 space-y-10">
          <section className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-headline font-semibold mb-4 text-primary flex items-center gap-2">
                <Target className="w-8 h-8" />
                Nuestra Misión
              </h2>
              <p className="text-lg text-foreground/90 leading-relaxed">
                En Escuelita, nuestra misión es democratizar el acceso a la educación de calidad, 
                fomentando una comunidad de aprendizaje colaborativo donde cada miembro pueda alcanzar 
                su máximo potencial. Buscamos inspirar la curiosidad, promover el pensamiento crítico y 
                desarrollar habilidades prácticas para el mundo real.
              </p>
            </div>
            <div className="relative h-64 rounded-lg overflow-hidden shadow-md">
                <Image src="https://placehold.co/600x400.png" alt="Misión de la comunidad" layout="fill" objectFit="cover" data-ai-hint="students learning together"/>
            </div>
          </section>
          
          <hr className="my-8 border-border" />

          <section>
            <h2 className="text-3xl font-headline font-semibold mb-6 text-primary text-center flex items-center justify-center gap-2">
              <Lightbulb className="w-8 h-8" />
              Nuestros Valores Fundamentales
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { title: "Colaboración", description: "Fomentamos el trabajo en equipo y el apoyo mutuo como pilares del aprendizaje.", icon: <Handshake/> },
                { title: "Aprendizaje Continuo", description: "Inspiramos la curiosidad y la búsqueda constante de conocimiento y superación.", icon: <BookOpen/> },
                { title: "Inclusión y Diversidad", description: "Creamos un ambiente acogedor, respetuoso y equitativo para todos.", icon: <Users/> },
              ].map(value => (
                <Card key={value.title} className="bg-muted/50 hover:shadow-md transition-shadow">
                  <CardHeader className="flex flex-row items-center gap-3 pb-3">
                    <span className="text-accent p-2 bg-accent/10 rounded-full">{React.cloneElement(value.icon, { className: "w-6 h-6" })}</span>
                    <CardTitle className="text-xl font-semibold">{value.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{value.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <hr className="my-8 border-border" />

          <section className="text-center bg-primary/5 p-8 rounded-lg">
            <h2 className="text-3xl font-headline font-semibold mb-4 text-primary flex items-center justify-center gap-2">
              <Users className="w-8 h-8" />
              Únete a la Aventura del Conocimiento
            </h2>
            <p className="text-lg text-foreground/90 leading-relaxed mb-6 max-w-3xl mx-auto">
              Si compartes nuestra pasión por el aprendizaje, la innovación y la colaboración, 
              ¡Escuelita es tu lugar! Explora nuestros cursos, participa activamente en los foros 
              y conecta con una red de individuos motivados y talentosos.
            </p>
            <div className="flex gap-4 justify-center">
                <Button size="lg" asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  <Link href="/">Explorar Cursos</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/community">Visitar Comunidad</Link>
                </Button>
            </div>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}

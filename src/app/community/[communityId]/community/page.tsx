"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import {
  Users,
  Info,
  Calendar as CalendarIcon,
  MessageSquare,
  Clock,
  User as UserIcon,
  Loader2,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { NewCommunityThreadForm } from "./components/NewCommunityThreadForm";
import { useSupabase } from "@/context/SupabaseContext";
import type { ForumThread } from "@/lib/types"; // Assuming you have a type definition for ForumThread

export default function CommunityPage() {
  const supabase = useSupabase();
  const [communityThreads, setCommunityThreads] = useState<ForumThread[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCommunityThreads() {
      const { data, error } = await supabase
        .from("community_threads")
        .select("*, author:users(name, avatar_url)") // Join with users table and select author's name and avatar
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching community threads:", error);
        setError("Error al cargar las discusiones.");
      } else {
        // You might need to map or transform the data from Supabase to match your ForumThread type
        setCommunityThreads(data as ForumThread[]);
        // Map the data to match the ForumThread type expected by ForumPostCard
        const formattedData = data.map((thread) => ({
          ...thread,
          authorName: thread.author?.name || "Unknown User", // Use author.name as authorName
          userAvatarUrl: thread.author?.avatar_url || null, // Use author.avatar_url as userAvatarUrl
          // Assuming your threads table has a 'postCount' or similar column,
          // otherwise you might need to fetch this separately or count comments
          postCount: thread.postCount || 0,
        }));
        setCommunityThreads(formattedData as ForumThread[]);
      }
      setLoading(false);
    }

    fetchCommunityThreads();
  }, [supabase]);

  return (
    <div className="space-y-8">
      <section className="text-center py-8 bg-muted/30 rounded-lg">
        <h1 className="text-4xl font-headline font-bold mb-3 text-primary">
          Bienvenido al Foro Comunitario
        </h1>
        <p className="text-xl text-foreground/80 max-w-3xl mx-auto">
          Participa, pregunta y comparte tus conocimientos con toda la
          comunidad.
        </p>
      </section>

      <NewCommunityThreadForm />

      <section className="space-y-6">
        <h2 className="text-2xl font-headline font-semibold mt-10">
          Discusiones Activas
        </h2>
        {communityThreads.length > 0 ? (
          loading ? (
            <div className="flex justify-center items-center">
              <Loader2 className="mr-2 h-8 w-8 animate-spin" />
              <p>Cargando discusiones...</p>
            </div>
          ) : error ? (
            <div className="text-center text-red-500">{error}</div>
          ) : (
            communityThreads.map((thread: ForumThread) => (
              <Card
                key={thread.id}
                className="hover:shadow-md transition-shadow rounded-lg"
              >
                <CardHeader>
                  <CardTitle className="text-xl font-headline">
                    <Link
                      href={`/community/threads/${thread.id}`}
                      className="hover:text-primary"
                    >
                      {thread.title}
                    </Link>
                  </CardTitle>
                  <CardDescription className="text-xs flex flex-wrap gap-x-3 gap-y-1 items-center">
                    <span className="flex items-center gap-1">
                      <UserIcon className="w-3 h-3" /> Por{" "}
                      {thread.authorName || "Unknown User"}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Iniciado{" "}
                      {formatDistanceToNow(new Date(thread.createdAt), {
                        addSuffix: true,
                      })}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageSquare className="w-3 h-3" /> {thread.postCount}{" "}
                      posts
                    </span>
                  </CardDescription>
                </CardHeader>
                <CardFooter>
                  <Button
                    variant="link"
                    asChild
                    className="p-0 h-auto text-primary"
                  >
                    <Link href={`/community/threads/${thread.id}`}>
                      Ver Discusión &rarr;
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))
          )
        ) : (
          <Card className="rounded-lg">
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">
                Aún no hay discusiones en la comunidad. ¡Sé el primero en
                iniciar una!
              </p>
            </CardContent>
          </Card>
        )}
      </section>

      <hr className="my-12" />

      <section>
        <h2 className="text-2xl font-headline font-semibold mb-6 text-center">
          Más de la Comunidad
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="shadow-md hover:shadow-lg transition-shadow rounded-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-headline text-xl">
                <Info className="w-6 h-6 text-primary" />
                Acerca de Nosotros
              </CardTitle>
              <CardDescription>
                Descubre nuestra misión, visión y los valores que nos unen.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4 text-sm">
                Conoce más sobre el propósito de nuestra comunidad y cómo puedes
                ser parte de ella.
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
              <CardDescription>
                Conecta con otros miembros y expande tu red.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4 text-sm">
                Explora los perfiles de quienes forman parte de esta vibrante
                comunidad.
              </p>
              <Button asChild variant="outline" className="w-full">
                <Link href="/members">Ver Miembros</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-md hover:shadow-lg transition-shadow rounded-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-headline text-xl">
                <CalendarIcon className="w-6 h-6 text-primary" />
                Calendario de Eventos
              </CardTitle>
              <CardDescription>
                No te pierdas nuestros próximos eventos y talleres.
              </CardDescription>
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
      </section>
    </div>
  );
}

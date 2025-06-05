"use client";

import Link from "next/link";
import Image from "next/image";
import { useSupabase } from "@/context/SupabaseContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Users as UsersIcon, CalendarDays } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import React, { useState } from "react";

export default function MembersPage() {
  const { supabase } = useSupabase();
  const [members, setMembers] = useState<any[]>([]); // Consider using a more specific type
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    async function fetchMembers() {
      const { data, error } = await supabase
        .from("users")
        .select("id, name, avatar_url, bio, email, created_at"); // Adjust columns as needed
      if (error) {
        setError(error.message);
      } else {
        setMembers(data || []);
      }
      setLoading(false);
    }
    fetchMembers();
  }, [supabase]);

  return (
    <div className="space-y-8">
      <section className="text-center py-8 bg-muted/30 rounded-lg">
        <h1 className="text-4xl font-headline font-bold mb-3 text-primary">
          Nuestros Miembros
        </h1>
        <p className="text-xl text-foreground/80 max-w-2xl mx-auto">
          Conoce a las personas que forman parte de nuestra activa e inspiradora
          comunidad.
        </p>
      </section>

      {loading && <p className="text-center">Cargando miembros...</p>}
      {error && (
        <p className="text-center text-red-500">
          Error al cargar miembros: {error}
        </p>
      )}

      {!loading && !error && members.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {members.map((member) => (
            <Card
              key={member.id}
              className="flex flex-col overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 rounded-lg"
            >
              <CardHeader className="items-center text-center p-6 bg-card border-b">
                <Avatar className="h-28 w-28 mb-4 border-4 border-primary/50 shadow-sm">
                  <AvatarImage
                    src={member.avatar_url}
                    alt={member.name}
                    data-ai-hint="person portrait"
                  />
                  <AvatarFallback className="text-4xl bg-muted text-primary">
                    {member.name
                      ? member.name.substring(0, 2).toUpperCase()
                      : "?"}
                  </AvatarFallback>
                </Avatar>
                <CardTitle className="text-2xl font-headline">
                  <Link
                    href={`/profile/${member.id}`}
                    className="hover:text-primary transition-colors"
                  >
                    {member.name || "Usuario sin nombre"}
                  </Link>
                </CardTitle>
                {member.bio && (
                  <CardDescription className="text-sm text-muted-foreground line-clamp-3 mt-1 h-16">
                    {member.bio}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent className="p-4 flex-grow">
                <div className="text-sm text-muted-foreground space-y-2">
                  <p className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-accent" />{" "}
                    {member.email || "No proporcionado"}
                  </p>
                  <p className="flex items-center gap-2">
                    <CalendarDays className="w-4 h-4 text-accent" /> Unido{" "}
                    {member.created_at
                      ? formatDistanceToNow(new Date(member.created_at), {
                          addSuffix: true,
                          locale: es,
                        })
                      : "Fecha no disponible"}
                  </p>
                </div>
              </CardContent>
              <CardFooter className="p-4 border-t">
                <Button
                  asChild
                  className="w-full bg-primary hover:bg-primary/90"
                >
                  <Link href={`/profile/${member.id}`}>Ver Perfil</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="shadow-md">
          <CardContent className="pt-10 pb-10 text-center">
            <UsersIcon className="w-16 h-16 mx-auto text-muted-foreground mb-6" />
            <h2 className="text-2xl font-semibold mb-2">Aún no hay miembros</h2>
            <p className="text-muted-foreground">
              Parece que nuestra comunidad está empezando. ¡Anímate a invitar a
              más personas!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

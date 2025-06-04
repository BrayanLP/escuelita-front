"use client";
import * as React from "react";
import { useEffect, useState } from "react";
import { Calendar as CalendarIconLucide } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useSupabase } from "@/context/SupabaseContext";

// Placeholder for event data structure
interface CommunityEvent {
  date: Date;
  title: string;
  description: string;
  type: "Taller" | "Charla" | "Reunión";
}

export default function CalendarPage() {
  const supabase = useSupabase();
  const [events, setEvents] = useState<CommunityEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );
  const [eventsForSelectedDate, setEventsForSelectedDate] = useState<
    CommunityEvent[]
  >([]);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("calendar_events")
        .select("*");
      if (error) {
        setError(error.message);
        setEvents([]);
      } else {
        // Map Supabase data to CommunityEvent interface
        const formattedEvents: CommunityEvent[] = data.map((event: any) => ({
          date: new Date(event.start_time), // Assuming start_time is a valid date string/timestamp
          title: event.title,
          description: event.description,
          type: event.type, // Assuming 'type' column exists and matches CommunityEvent types
        }));
        setEvents(formattedEvents);
      }
      setLoading(false);
    };
    fetchEvents();
  }, [supabase]); // Refetch when supabase client changes (unlikely but good practice)

  useEffect(() => {
    if (selectedDate) {
      const filteredEvents = events.filter(
        (event) => event.date.toDateString() === selectedDate.toDateString()
      );
      setEventsForSelectedDate(filteredEvents);
    } else {
      setEventsForSelectedDate([]);
    }
  }, [selectedDate, events]); // Update filtered events when selected date or all events change

  return (
    <div className="space-y-8">
      <section className="text-center py-8 bg-muted/30 rounded-lg">
        <h1 className="text-4xl font-headline font-bold mb-3 text-primary">
          Calendario de Eventos
        </h1>
        <p className="text-xl text-foreground/80 max-w-2xl mx-auto">
          Mantente al día con los próximos eventos, talleres y actividades de la
          comunidad.
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-headline">
                <CalendarIconLucide className="w-6 h-6 text-primary" />
                Selecciona una Fecha
              </CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center p-0">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md"
                modifiers={{
                  hasEvent: events.map((event) => event.date),
                }}
                modifiersClassNames={{
                  hasEvent: "bg-primary/20 text-primary rounded-full",
                }}
              />
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Card className="shadow-lg min-h-[300px]">
            <CardHeader>
              <CardTitle className="font-headline">
                Eventos para{" "}
                {selectedDate
                  ? selectedDate.toLocaleDateString("es-ES", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "Hoy"}
              </CardTitle>
              <CardDescription>
                {selectedDate
                  ? `Actividades programadas para esta fecha.`
                  : `Selecciona una fecha para ver los eventos.`}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {loading && (
                <p className="text-muted-foreground text-center py-10">
                  Cargando eventos...
                </p>
              )}
              {error && (
                <p className="text-destructive text-center py-10">
                  Error al cargar eventos: {error}
                </p>
              )}
              {!loading && !error && eventsForSelectedDate.length === 0 && (
                <p className="text-muted-foreground text-center py-10">
                  {selectedDate
                    ? "No hay eventos programados para esta fecha."
                    : "Selecciona una fecha del calendario para ver los eventos."}
                </p>
              )}
              {eventsForSelectedDate.length > 0 &&
                eventsForSelectedDate.map((event, index) => (
                  <Card
                    key={index}
                    className="bg-background hover:shadow-md transition-shadow"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg font-semibold text-accent">
                          {event.title}
                        </CardTitle>
                        <Badge
                          variant={
                            event.type === "Taller"
                              ? "default"
                              : event.type === "Charla"
                              ? "secondary"
                              : "outline"
                          }
                        >
                          {event.type}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        {event.description}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        Hora: (No especificada)
                      </p>
                    </CardContent>
                  </Card>
                ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

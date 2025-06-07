"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { DataTable, Column } from "@/components/admin/data-table";
import { EventForm } from "@/components/admin/event-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { CalendarEvent } from "@/lib/types";
import { supabase } from "@/lib/supabase/client";
import { toast } from "sonner";
import { Plus, Calendar } from "lucide-react";

export default function EventsPage() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);

  const columns: Column<CalendarEvent>[] = [
    { key: "title", label: "Título" },
    {
      key: "start_time",
      label: "Fecha de Inicio",
      render: (value: string) => new Date(value).toLocaleString("es-ES"),
    },
    {
      key: "end_time",
      label: "Fecha de Fin",
      render: (value: string) =>
        value ? new Date(value).toLocaleString("es-ES") : "Sin fecha fin",
    },
    {
      key: "description",
      label: "Descripción",
      render: (value: string) =>
        value
          ? value.length > 50
            ? value.substring(0, 50) + "..."
            : value
          : "Sin descripción",
    },
    {
      key: "created_at",
      label: "Creado",
      render: (value: string) => new Date(value).toLocaleDateString("es-ES"),
    },
  ];

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from("calendar_events")
        .select("*")
        .order("start_time", { ascending: false });

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error("Error fetching events:", error);
      toast.error("Error al cargar los eventos");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (event: CalendarEvent) => {
    setEditingEvent(event);
    setShowForm(true);
  };

  const handleDelete = async (event: CalendarEvent) => {
    if (!confirm("¿Estás seguro de que quieres eliminar este evento?")) return;

    try {
      const { error } = await supabase
        .from("calendar_events")
        .delete()
        .eq("id", event.id);

      if (error) throw error;
      toast.success("Evento eliminado exitosamente");
      fetchEvents();
    } catch (error) {
      console.error("Error deleting event:", error);
      toast.error("Error al eliminar el evento");
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingEvent(null);
    fetchEvents();
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingEvent(null);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Eventos</h1>
        </div>
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Calendar className="h-8 w-8" />
            Eventos
          </h1>
          <p className="text-gray-600">
            Gestiona todos los eventos del calendario
          </p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Evento
        </Button>
      </div>

      <DataTable
        data={events}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchPlaceholder="Buscar eventos..."
      />

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingEvent ? "Editar Evento" : "Nuevo Evento"}
            </DialogTitle>
          </DialogHeader>
          <EventForm
            event={editingEvent}
            onSuccess={handleFormSuccess}
            onCancel={handleFormCancel}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

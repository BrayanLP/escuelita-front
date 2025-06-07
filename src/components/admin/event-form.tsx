"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { eventSchema, EventFormData } from "@/lib/schemas";
import { CalendarEvent } from "@/lib/types";
import { supabase } from "@/lib/supabase/client";
import { toast } from "sonner";

interface EventFormProps {
  event?: CalendarEvent;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function EventForm({ event, onSuccess, onCancel }: EventFormProps) {
  const [loading, setLoading] = useState(false);

  const form = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: event?.title || "",
      description: event?.description || "",
      start_time: event?.start_time
        ? new Date(event.start_time).toISOString().slice(0, 16)
        : "",
      end_time: event?.end_time
        ? new Date(event.end_time).toISOString().slice(0, 16)
        : "",
    },
  });

  const onSubmit = async (data: EventFormData) => {
    setLoading(true);
    try {
      const eventData = {
        title: data.title,
        description: data.description,
        start_time: new Date(data.start_time).toISOString(),
        end_time: data.end_time ? new Date(data.end_time).toISOString() : null,
      };

      if (event) {
        const { error } = await supabase
          .from("calendar_events")
          .update(eventData)
          .eq("id", event.id);

        if (error) throw error;
        toast.success("Evento actualizado exitosamente");
      } else {
        const { error } = await supabase
          .from("calendar_events")
          .insert([eventData]);

        if (error) throw error;
        toast.success("Evento creado exitosamente");
      }

      onSuccess?.();
    } catch (error) {
      console.error("Error saving event:", error);
      toast.error("Error al guardar el evento");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{event ? "Editar Evento" : "Nuevo Evento"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Título *</Label>
            <Input
              id="title"
              {...form.register("title")}
              placeholder="Título del evento"
            />
            {form.formState.errors.title && (
              <p className="text-sm text-red-600">
                {form.formState.errors.title.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              {...form.register("description")}
              placeholder="Descripción del evento"
              rows={3}
            />
            {form.formState.errors.description && (
              <p className="text-sm text-red-600">
                {form.formState.errors.description.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start_time">Fecha y Hora de Inicio *</Label>
              <Input
                id="start_time"
                type="datetime-local"
                {...form.register("start_time")}
              />
              {form.formState.errors.start_time && (
                <p className="text-sm text-red-600">
                  {form.formState.errors.start_time.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="end_time">Fecha y Hora de Fin</Label>
              <Input
                id="end_time"
                type="datetime-local"
                {...form.register("end_time")}
              />
              {form.formState.errors.end_time && (
                <p className="text-sm text-red-600">
                  {form.formState.errors.end_time.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            {onCancel && (
              <Button type="button\" variant="outline\" onClick={onCancel}>
                Cancelar
              </Button>
            )}
            <Button type="submit" disabled={loading}>
              {loading ? "Guardando..." : event ? "Actualizar" : "Crear"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

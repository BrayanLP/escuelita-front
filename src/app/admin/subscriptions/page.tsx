"use client";

import { useState, useEffect } from "react";
import { DataTable, Column } from "@/components/admin/data-table";
import { Badge } from "@/components/ui/badge";
import { Subscription } from "@/lib/types";
import { supabase } from "@/lib/supabase/client";
import { toast } from "sonner";
import { CreditCard } from "lucide-react";

export default function SubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);

  const columns: Column<Subscription>[] = [
    {
      key: "profile.full_name",
      label: "Usuario",
      render: (value: string) => value || "Usuario anónimo",
    },
    {
      key: "community.name",
      label: "Comunidad",
      render: (value: string) => value || "Comunidad no especificada",
    },
    {
      key: "status",
      label: "Estado",
      render: (value: string) => {
        const variant =
          value === "active"
            ? "default"
            : value === "pending"
            ? "secondary"
            : "destructive";
        return <Badge variant={variant}>{value}</Badge>;
      },
    },
    {
      key: "created_at",
      label: "Suscrito",
      render: (value: string) => new Date(value).toLocaleDateString("es-ES"),
    },
    {
      key: "validated_at",
      label: "Validado",
      render: (value: string) =>
        value ? new Date(value).toLocaleDateString("es-ES") : "Pendiente",
    },
  ];

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    try {
      const { data, error } = await supabase
        .from("community_subscriptions")
        .select(
          `
          *,
          profile:profiles(full_name, email),
          community:communities(name, slug)
        `
        )
        .order("created_at", { ascending: false });

      if (error) throw error;
      setSubscriptions(data || []);
    } catch (error) {
      console.error("Error fetching subscriptions:", error);
      toast.error("Error al cargar las suscripciones");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Suscripciones</h1>
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
            <CreditCard className="h-8 w-8" />
            Suscripciones
          </h1>
          <p className="text-gray-600">
            Gestiona todas las suscripciones de la plataforma
          </p>
        </div>
      </div>

      <DataTable
        data={subscriptions}
        columns={columns}
        searchPlaceholder="Buscar suscripciones..."
      />
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { DataTable, Column } from "@/components/admin/data-table";
import { Profile } from "@/lib/types";
import { supabase } from "@/lib/supabase/client";
import { toast } from "sonner";
import { Users, Star as Avatar } from "lucide-react";

export default function UsersPage() {
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  const columns: Column<Profile>[] = [
    {
      key: "avatar_url",
      label: "Avatar",
      render: (value: string, user: Profile) => (
        <div className="flex items-center space-x-2">
          {value ? (
            <img
              src={value}
              alt={user.full_name || ""}
              className="w-8 h-8 rounded-full"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
              <Avatar className="w-4 h-4 text-gray-400" />
            </div>
          )}
        </div>
      ),
    },
    { key: "full_name", label: "Nombre Completo" },
    { key: "email", label: "Email" },
    {
      key: "created_at",
      label: "Registrado",
      render: (value: string) => new Date(value).toLocaleDateString("es-ES"),
    },
  ];

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });
      console.log("data", data);
      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Error al cargar los usuarios");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Usuarios</h1>
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
            <Users className="h-8 w-8" />
            Usuarios
          </h1>
          <p className="text-gray-600">
            Gestiona todos los usuarios de la plataforma
          </p>
        </div>
      </div>

      <DataTable
        data={users}
        columns={columns}
        searchPlaceholder="Buscar usuarios..."
      />
    </div>
  );
}

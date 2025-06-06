"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type PaymentMethod = {
  id: string;
  method: string;
  instructions: string;
  active: boolean;
};

export default function BillingPage() {
  const { communityId } = useParams();
  const [methods, setMethods] = useState<PaymentMethod[]>([]);

  useEffect(() => {
    const loadMethods = async () => {
      const { data, error } = await supabase
        .from("community_payment_methods")
        .select("*")
        .eq("community_id", communityId)
        .eq("active", true);

      if (!error && data) {
        setMethods(data);
      }
    };

    loadMethods();
  }, [communityId]);

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Métodos de pago</h1>

      {methods.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Esta comunidad aún no tiene métodos de pago activos.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {methods.map((m) => (
            <Card key={m.id}>
              <CardHeader>
                <CardTitle className="capitalize">{m.method}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {m.instructions}
                </p>
                <Badge className="mt-2">
                  {m.active ? "Activo" : "Inactivo"}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

// app/community/[communityId]/profile/subscriptions/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

type Subscription = {
  id: string;
  method: string;
  status: string;
  created_at: string;
  communities: {
    name: string;
  };
};

export default function SubscriptionsPage() {
  const { communityId } = useParams();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSubscription = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data, error } = await supabase
        .from("subscriptions")
        .select("id, method, status, created_at, communities(name)")
        .eq("user_id", user.id)
        .eq("community_id", communityId)
        .single();

      if (!error && data) {
        setSubscription(data);
      }

      setLoading(false);
    };

    loadSubscription();
  }, [communityId]);

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Mi suscripción</h1>

      {loading ? (
        <Skeleton className="w-full h-32 rounded" />
      ) : subscription ? (
        <Card>
          <CardHeader>
            <CardTitle>{subscription.communities.name}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p>
              <strong>Método de pago:</strong> {subscription.method}
            </p>
            <p>
              <strong>Estado:</strong>{" "}
              <Badge
                variant={
                  subscription.status === "active"
                    ? "default"
                    : subscription.status === "pending"
                    ? "secondary"
                    : "destructive"
                }
              >
                {subscription.status}
              </Badge>
            </p>
            <p>
              <strong>Inicio:</strong>{" "}
              {new Date(subscription.created_at).toLocaleDateString()}
            </p>
          </CardContent>
        </Card>
      ) : (
        <p className="text-muted-foreground text-sm">
          No estás suscrito a esta comunidad.
        </p>
      )}
    </div>
  );
}

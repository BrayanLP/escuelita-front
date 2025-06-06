// components/payment-methods-list.tsx
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { PaymentMethodCard } from "./payment-method-card";

export function PaymentMethodsList({ communityId }: { communityId: string }) {
  const [methods, setMethods] = useState<any[]>([]);

  useEffect(() => {
    getInfo();
  }, [communityId]);

  const getInfo = async () => {
    const { data: community } = await supabase
      .from("communities")
      .select("*")
      .eq("slug", communityId)
      .single();

    supabase
      .from("community_payment_methods")
      .select("*, payment_methods(name)")
      .eq("community_id", community?.id)
      .eq("enabled", true)
      .then(({ data }) => {
        setMethods(data || []);
      });
  };
  return (
    <div className="space-y-4">
      {methods.map((method) => (
        <PaymentMethodCard
          key={method.id}
          method={{
            name: method.payment_methods.name,
            instructions: method.instructions,
            image_url: method.image_url,
          }}
        />
      ))}
    </div>
  );
}

"use client";
import { PaymentMethodModal } from "@/components/modals/payment-method-modal";
import { PaymentMethodsList } from "@/components/payment-methods-list";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function PaymentMethodsPage({
  params,
}: {
  params: { communityId: string };
}) {
  const communityId = params.communityId;
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Métodos de pago</h1>
      <Button onClick={() => setOpen(true)}>Agregar método de pago</Button>

      <PaymentMethodModal
        open={open}
        onClose={() => setOpen(false)}
        communityId={communityId}
      />

      <PaymentMethodsList communityId={communityId} />
    </div>
  );
}

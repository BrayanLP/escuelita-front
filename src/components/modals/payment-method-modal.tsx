// components/modals/payment-method-modal.tsx
"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/lib/supabase/client";
import { toast } from "sonner";
import { uploadImageToStorage } from "@/lib/upload-image";
interface Props {
  open: boolean;
  onClose: () => void;
  communityId: string;
  image_url?: string;
}

export function PaymentMethodModal({ open, onClose, communityId }: Props) {
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [instructions, setInstructions] = useState("");
  const [enabled, setEnabled] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    if (!open) return;

    supabase
      .from("payment_methods")
      .select("id, name")
      .eq("enabled", true)
      .then(({ data }) => setPaymentMethods(data || []));
  }, [open]);

  const handleSubmit = async () => {
    setIsSaving(true);
    let uploadedUrl = "";

    if (file) {
      const result = await uploadImageToStorage(
        file,
        `qrs/${crypto.randomUUID()}`
      );
      if (result.error) {
        toast.error("Error subiendo imagen");
        setIsSaving(false);
        return;
      }
      uploadedUrl = result.url;
    }

    const { data: community } = await supabase
      .from("communities")
      .select("*")
      .eq("slug", communityId)
      .single();

    const { error } = await supabase.from("community_payment_methods").insert({
      community_id: community?.id,
      payment_method_id: selectedPaymentMethod,
      instructions,
      enabled,
      image_url: uploadedUrl,
    });

    setIsSaving(false);

    if (error) {
      toast.error("Error al guardar", { description: error.message });
    } else {
      toast.success("Método de pago agregado");
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md space-y-4">
        <h2 className="text-lg font-semibold">Nuevo método de pago</h2>

        <div className="space-y-2">
          <Label>Método</Label>
          <select
            value={selectedPaymentMethod}
            onChange={(e) => setSelectedPaymentMethod(e.target.value)}
            className="w-full border rounded px-3 py-2 text-sm"
          >
            <option value="">Selecciona uno</option>
            {paymentMethods.map((method) => (
              <option key={method.id} value={method.id}>
                {method.name}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <Label>Instrucciones</Label>
          <Textarea
            placeholder="Ej: Transferir a cuenta BCP 123456..."
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Imagen o QR (opcional)</Label>
          <Input
            type="file"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files?.[0]) setFile(e.target.files[0]);
            }}
          />
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="enabled"
            checked={enabled}
            onCheckedChange={(checked) => setEnabled(!!checked)}
          />
          <Label htmlFor="enabled">Activo</Label>
        </div>

        <Button
          onClick={handleSubmit}
          className="w-full"
          disabled={isSaving || !selectedPaymentMethod}
        >
          {isSaving ? "Guardando..." : "Guardar"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}

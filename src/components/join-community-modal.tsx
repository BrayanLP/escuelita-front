"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { supabase } from "@/lib/supabase/client";
import { toast } from "sonner";
import Image from "next/image";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { AlertCircleIcon } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
  community: any;
  userId: string | null;
}

export function JoinCommunityModal({
  open,
  onClose,
  community,
  userId,
}: Props) {
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedMethodId, setSelectedMethodId] = useState<string | null>(null);
  const [existingRequest, setExistingRequest] = useState(false);

  useEffect(() => {
    if (open && userId && community.id) {
      // verificar suscripción pendiente
      supabase
        .from("community_subscriptions")
        .select("id")
        .eq("community_id", community.id)
        .eq("user_id", userId)
        .eq("status", "pending")
        .maybeSingle()
        .then(({ data }) => {
          setExistingRequest(!!data);
        });

      // obtener métodos de pago si no es gratis
      if (!community.is_public) {
        supabase
          .from("community_payment_methods")
          .select("*, payment_methods(name)")
          .eq("community_id", community.id)
          .eq("enabled", true)
          .then(({ data }) => setPaymentMethods(data || []));
      }
    }
  }, [open, community, userId]);

  const handleJoin = async () => {
    if (!userId) {
      toast.error("Necesitas iniciar sesión");
      return;
    }

    setLoading(true);
    const { error } = await supabase.from("community_members").insert({
      community_id: community.id,
      user_id: userId,
    });

    setLoading(false);

    if (error) {
      toast.error("Error al unirte", { description: error.message });
    } else {
      toast.success("Te uniste a la comunidad");
      onClose();
      location.reload();
    }
  };

  // const handleJoinFree = async () => {
  //   if (!userId) {
  //     toast.error("Necesitas iniciar sesión");
  //     return;
  //   }

  //   setLoading(true);
  //   const { error } = await supabase.from("community_members").insert({
  //     community_id: community.id,
  //     user_id: userId,
  //   });

  //   setLoading(false);

  //   if (error) {
  //     toast.error("Error al unirte", { description: error.message });
  //   } else {
  //     toast.success("Te uniste a la comunidad");
  //     onClose();
  //     location.reload();
  //   }
  // };

  const handlePaidJoinRequest = async (selectedMethodId: string) => {
    if (!selectedMethodId) {
      toast.error("Selecciona un método de pago");
      return;
    }

    if (!userId) {
      toast.error("Necesitas iniciar sesión");
      return;
    }

    setLoading(true);
    const { error } = await supabase.from("community_subscriptions").insert({
      community_id: community.id,
      user_id: userId,
      payment_method_id: selectedMethodId,
      status: "pending",
    });

    setLoading(false);

    if (error) {
      toast.error("Error al registrar pago", { description: error.message });
    } else {
      toast.success("Solicitud enviada. Un administrador revisará tu pago.");
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md space-y-4">
        <h2 className="text-xl font-bold">Unirme a {community.name}</h2>

        {community.is_public ? (
          <>
            <p className="text-sm text-muted-foreground">
              Esta comunidad es gratuita. Al unirte tendrás acceso al contenido
              interno.
            </p>
            <Button
              className="w-full mt-4"
              onClick={handleJoin}
              disabled={loading}
            >
              {loading ? "Uniéndote..." : "Unirme"}
            </Button>
          </>
        ) : (
          <>
            <p className="text-sm text-muted-foreground">
              Esta comunidad requiere un pago. Elige un método de pago
              disponible:
            </p>

            <Accordion
              type="single"
              collapsible
              className="w-full"
              value={selectedMethodId || ""}
              onValueChange={(value) => setSelectedMethodId(value || null)}
            >
              {paymentMethods.map((method) => (
                <AccordionItem key={method.id} value={method.id}>
                  <AccordionTrigger className="capitalize font-semibold text-left">
                    {method.payment_methods.name}
                  </AccordionTrigger>
                  <AccordionContent className="space-y-2 text-sm">
                    <p>{method.instructions}</p>
                    {console.log("method", method)}
                    {method.image_url && (
                      <Image
                        src={method.image_url}
                        alt="QR"
                        width={200}
                        height={200}
                        className="rounded   max-w-xs mx-auto"
                      />
                    )}

                    {existingRequest ? (
                      <Alert variant="destructive">
                        <AlertCircleIcon />
                        <AlertTitle>Importante.</AlertTitle>
                        <AlertDescription>
                          <p>
                            Tu solicitud de suscripción está en proceso de
                            validación. Si no has completado el pago, te
                            recomendamos verificar las instrucciones del método
                            de pago elegido.
                          </p>
                          {/* <ul className="list-inside list-disc text-sm">
                           <li>Check your card details</li>
                           <li>Ensure sufficient funds</li>
                           <li>Verify billing address</li>
                         </ul>
                         <div className="mt-4 text-sm text-muted-foreground text-center">
                        
                      </div> */}
                        </AlertDescription>
                      </Alert>
                    ) : (
                      <>
                        {" "}
                        <Button
                          className="w-full mt-4"
                          onClick={() =>
                            handlePaidJoinRequest(method.payment_method_id)
                          }
                          disabled={loading || !selectedMethodId}
                        >
                          {loading
                            ? "Enviando..."
                            : "Confirmar pago por " +
                              method.payment_methods.name}
                        </Button>
                        <p className="text-xs text-center text-muted-foreground mt-4">
                          Tu solicitud será validada por un administrador.
                        </p>
                      </>
                    )}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

import { supabase } from "@/lib/supabase/client";
import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Router } from "lucide-react";
import { useRouter } from "next/navigation";

export function CreateCommunityModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [view, setView] = useState<
    "register" | "pending-confirmation" | "create-community"
  >("register");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");

  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signUp({ email, password });

    setLoading(false);

    if (error) {
      toast.error("Error al registrarte", { description: error.message });
    } else {
      toast.success("Te registraste. Revisa tu correo para confirmar.");
      setView("pending-confirmation");
    }
  };

  const handleCreateCommunity = async () => {
    setLoading(true);
    const { data: session } = await supabase.auth.getSession();

    const user = session?.session?.user;

    if (!user) {
      toast.error("Primero inicia sesión o verifica tu correo.");
      setLoading(false);
      return;
    }

    const { error } = await supabase.from("communities").insert({
      name,
      slug,
      user_id: user.id,
    });

    setLoading(false);

    if (error) {
      toast.error("Error al crear comunidad", { description: error.message });
    } else {
      toast.success("¡Comunidad creada!");
      onClose();
      router.push("/community/" + slug + "/profile/settings");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md space-y-5">
        {view === "register" && (
          <>
            <h2 className="text-lg font-bold text-center">
              Regístrate para crear tu comunidad
            </h2>
            <Input
              placeholder="Correo"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder="Contraseña"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              className="w-full"
              disabled={loading}
              onClick={handleRegister}
            >
              {loading ? "Enviando..." : "Registrarme"}
            </Button>
          </>
        )}

        {view === "pending-confirmation" && (
          <div className="text-center">
            <h2 className="text-lg font-semibold">Revisa tu correo</h2>
            <p className="text-sm text-muted-foreground">
              Te hemos enviado un enlace de confirmación. Una vez verificado,
              vuelve aquí para continuar.
            </p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => setView("create-community")}
            >
              Ya confirmé, continuar
            </Button>
          </div>
        )}

        {view === "create-community" && (
          <>
            <h2 className="text-lg font-bold text-center">Crear comunidad</h2>
            <Input
              placeholder="Nombre de la comunidad"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input
              placeholder="Slug único (ej. mi-comunidad)"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
            />
            <Button
              className="w-full"
              disabled={loading}
              onClick={handleCreateCommunity}
            >
              {loading ? "Creando..." : "Crear Comunidad"}
            </Button>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

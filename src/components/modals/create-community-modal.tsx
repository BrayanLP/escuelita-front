"use client";

import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { communitySchema, registerSchema } from "@/lib/create-community-schema";
import { z } from "zod";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-provider";
import { slugify } from "@/lib/slugify";

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

  const registerForm = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
  });

  const communityForm = useForm<z.infer<typeof communitySchema>>({
    resolver: zodResolver(communitySchema),
  });

  const router = useRouter();
  const { user } = useAuth();
  const nameValue = communityForm.watch("name");

  useEffect(() => {
    if (user?.id) {
      setView("create-community");
    }
  }, [user?.id]);

  useEffect(() => {
    if (nameValue) {
      const generatedSlug = slugify(nameValue);
      communityForm.setValue("slug", generatedSlug, { shouldValidate: true });
    }
  }, [nameValue]);

  const handleRegister = async (data: z.infer<typeof registerSchema>) => {
    const { error } = await supabase.auth.signUp(data);
    if (error) {
      toast.error("Error al registrarte", { description: error.message });
    } else {
      toast.success("Te registraste. Revisa tu correo para confirmar.");
      setView("pending-confirmation");
    }
  };

  const handleCreateCommunity = async (
    data: z.infer<typeof communitySchema>
  ) => {
    const { data: session } = await supabase.auth.getSession();
    const user = session?.session?.user;

    if (!user) {
      toast.error("Primero inicia sesión o verifica tu correo.");
      return;
    }

    const { error } = await supabase.from("communities").insert({
      name: data.name,
      slug: data.slug,
      user_id: user.id,
    });

    if (error) {
      toast.error("Error al crear comunidad", { description: error.message });
    } else {
      toast.success("¡Comunidad creada!");
      onClose();
      router.push("/community/" + data.slug + "/profile/settings");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogTitle> </DialogTitle>
      <DialogContent className="max-w-md space-y-5">
        {view === "register" && (
          <Form {...registerForm}>
            <h2 className="text-lg font-bold text-center">
              Regístrate para crear tu comunidad
            </h2>

            <form
              onSubmit={registerForm.handleSubmit(handleRegister)}
              className="space-y-4"
            >
              <FormField
                control={registerForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <label htmlFor="email">Correo electrónico</label>
                    <FormControl>
                      <Input id="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={registerForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <label htmlFor="password">Contraseña</label>
                    <FormControl>
                      <Input id="password" type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button className="w-full" type="submit">
                Registrarme
              </Button>
            </form>
          </Form>
        )}

        {view === "pending-confirmation" && (
          <div className="text-center space-y-4">
            <h2 className="text-lg font-semibold">Revisa tu correo</h2>
            <p className="text-sm text-muted-foreground">
              Te hemos enviado un enlace de confirmación.
            </p>
            <Button onClick={() => setView("create-community")}>
              Ya confirmé, continuar
            </Button>
          </div>
        )}

        {view === "create-community" && (
          <Form {...communityForm}>
            <h2 className="text-lg font-bold text-center">Crear Comunidad</h2>
            <form
              onSubmit={communityForm.handleSubmit(handleCreateCommunity)}
              className="space-y-4"
            >
              <FormField
                control={communityForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <label htmlFor="name">Nombre de la comunidad</label>
                    <FormControl>
                      <Input id="name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={communityForm.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <label htmlFor="slug">Slug único</label>
                    <FormControl>
                      <Input id="slug" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button className="w-full" type="submit">
                Crear Comunidad
              </Button>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}

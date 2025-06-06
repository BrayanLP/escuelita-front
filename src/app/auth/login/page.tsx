"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase/client";
import { useAuth } from "@/context/auth-provider";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

import Image from "next/image";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import Link from "next/link";

const formSchema = z.object({
  email: z.string().email("Correo inválido"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
});

type FormData = z.infer<typeof formSchema>;

export default function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link
            href="/"
            className="flex items-center gap-2 font-medium rounded-md p-1 hover:bg-primary/80 transition-colors"
          ></Link>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">
        <Image
          src="/assets/finance.jpg"
          alt="Image"
          fill
          className="object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
}

function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form">) {
  const router = useRouter();
  const { setUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "", password: "" },
  });

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session) {
        router.push("/");
      }
    });
  }, []);

  const onSubmit = async (values: FormData) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword(values);
      if (error) {
        if (error.message === "Email not confirmed") {
          router.push(`/verify-email?email=${values.email}`);
        }
        toast.error("Error al iniciar sesión", { description: error.message });
      } else {
        if (data.session.user?.confirmed_at) {
          const { data: existingProfile } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", data.user.id)
            .single();

          if (!existingProfile) {
            await supabase.from("profiles").insert({
              id: data.user.id,
              email: data.user.email,
              full_name: data.user.user_metadata.full_name,
            });
          }

          toast.success("Sesión iniciada");
          setUser(data.session.user);
          localStorage.setItem("user_id", data.session.user.id);
          router.push("/panel");
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md shadow-lg">
      <CardHeader>
        <CardTitle className="text-center text-2xl">Iniciar sesión</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="email">Correo electrónico</Label>
                  <FormControl>
                    <Input id="email" placeholder="" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => {
                const [showPassword, setShowPassword] = useState(false);

                return (
                  <FormItem>
                    <Label htmlFor="password">Contraseña</Label>
                    <div className="relative">
                      <FormControl>
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          {...field}
                          className="pr-10"
                        />
                      </FormControl>
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground"
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />

            <Button className="w-full" type="submit" disabled={isLoading}>
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Iniciando sesión...
                </div>
              ) : (
                "Entrar"
              )}
            </Button>
          </form>
        </Form>

        <div className="mt-4 text-center text-sm space-y-1">
          <p>
            ¿Olvidaste tu contraseña?{" "}
            <Link
              href="/reset-password"
              className="text-primary hover:underline"
            >
              Recuperar acceso
            </Link>
          </p>
          <p>
            ¿No tienes cuenta?{" "}
            <Link href="/register" className="text-primary hover:underline">
              Crear cuenta
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

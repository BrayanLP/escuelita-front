"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CreateCommunityModal } from "@/components/modals/create-community-modal";

export default function LandingPage() {
  const [open, setOpen] = useState(false);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen text-center px-4">
      <h1 className="text-2xl font-bold mb-2">
        Build a community around your passion.
      </h1>
      <p className="text-muted-foreground mb-8">
        Make money doing what you love.
      </p>

      {/* Carrusel mock */}
      <div className="relative w-full max-w-md mb-8">
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <img
            src="https://assets.skool.com/skool/d24f037a7f2042fa82acead8d4755670.jpg"
            alt="Example"
            className="w-full h-auto"
          />
          <div className="absolute top-2 right-2 bg-green-600 text-white text-xs px-3 py-1 rounded">
            Calligraphy School
            <br />
            Earns $6,237/month
          </div>
        </div>

        {/* Dots de navegación (puedes integrar swiper o carousel real) */}
        <div className="flex justify-center gap-1 mt-4">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full ${
                i === 0 ? "bg-primary" : "bg-muted"
              }`}
            />
          ))}
        </div>
      </div>

      <Button size="lg" onClick={() => setOpen(true)}>
        CREATE YOUR COMMUNITY
      </Button>

      <CreateCommunityModal open={open} onClose={() => setOpen(false)} />
    </main>
  );
}

// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { useForm } from "react-hook-form";
// import { z } from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { supabase } from "@/lib/supabase/client";
// import { toast } from "sonner";

// import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
// import {
//   Form,
//   FormField,
//   FormItem,
//   FormControl,
//   FormMessage,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Button } from "@/components/ui/button";
// import { Loader2 } from "lucide-react";
// import Link from "next/link";

// const formSchema = z
//   .object({
//     full_name: z.string().min(2, "Mínimo 2 caracteres"),
//     email: z.string().email("Correo inválido"),
//     password: z.string().min(6, "Mínimo 6 caracteres"),
//     confirm: z.string(),
//   })
//   .refine((data) => data.password === data.confirm, {
//     message: "Las contraseñas no coinciden",
//     path: ["confirm"],
//   });

// type FormData = z.infer<typeof formSchema>;

// export default function SignUpPage() {
//   const router = useRouter();
//   const [isLoading, setIsLoading] = useState(false);

//   const form = useForm<FormData>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       full_name: "",
//       email: "",
//       password: "",
//       confirm: "",
//     },
//   });

//   const onSubmit = async (values: FormData) => {
//     setIsLoading(true);

//     const { data, error } = await supabase.auth.signUp({
//       email: values.email,
//       password: values.password,
//       options: {
//         data: {
//           full_name: values.full_name,
//         },
//       },
//     });

//     if (error) {
//       toast.error("Error al registrarse", { description: error.message });
//     } else {
//       // opcional: insertar perfil inmediatamente si no requieres confirmación
//       if (data.user?.id) {
//         await supabase.from("profiles").insert({
//           id: data.user.id,
//           email: data.user.email,
//           full_name: values.full_name,
//         });
//       }

//       toast.success("Registro exitoso", {
//         description: "Revisa tu correo para confirmar tu cuenta.",
//       });

//       router.push(`/verify-email?email=${values.email}`);
//     }

//     setIsLoading(false);
//   };

//   return (
//     <div className="flex items-center justify-center min-h-svh p-6">
//       <Card className="w-full max-w-md shadow-lg">
//         <CardHeader>
//           <CardTitle className="text-2xl text-center">Crear cuenta</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <Form {...form}>
//             <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
//               <FormField
//                 control={form.control}
//                 name="full_name"
//                 render={({ field }) => (
//                   <FormItem>
//                     <Label>Nombre completo</Label>
//                     <FormControl>
//                       <Input placeholder="Ej. Juan Pérez" {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={form.control}
//                 name="email"
//                 render={({ field }) => (
//                   <FormItem>
//                     <Label>Correo electrónico</Label>
//                     <FormControl>
//                       <Input
//                         type="email"
//                         placeholder="correo@ejemplo.com"
//                         {...field}
//                       />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={form.control}
//                 name="password"
//                 render={({ field }) => (
//                   <FormItem>
//                     <Label>Contraseña</Label>
//                     <FormControl>
//                       <Input type="password" placeholder="••••••" {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={form.control}
//                 name="confirm"
//                 render={({ field }) => (
//                   <FormItem>
//                     <Label>Confirmar contraseña</Label>
//                     <FormControl>
//                       <Input type="password" placeholder="••••••" {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               <Button type="submit" className="w-full" disabled={isLoading}>
//                 {isLoading ? (
//                   <div className="flex items-center gap-2">
//                     <Loader2 className="w-4 h-4 animate-spin" />
//                     Registrando...
//                   </div>
//                 ) : (
//                   "Registrarse"
//                 )}
//               </Button>
//             </form>
//           </Form>
//           <div className="mt-4 text-sm text-center">
//             ¿Ya tienes cuenta?{" "}
//             <Link href="/login" className="text-primary hover:underline">
//               Inicia sesión
//             </Link>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }

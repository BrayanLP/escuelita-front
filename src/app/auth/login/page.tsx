
'use client';

import { useEffect, useState } from 'react';
import { useSupabase } from '@/contexts/SupabaseContext';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import Image from 'next/image';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

const formSchema = z.object({
  email: z.string().email('Correo inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
});

type FormData = z.infer<typeof formSchema>;

export default function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link
            href="/"
            className="flex items-center gap-2 font-medium rounded-md p-1 transition-colors hover:bg-primary/80"
          >
            <Image src="/assets/logo.png" alt="Logo" width={40} height={40} className="w-10 object-cover" />
            Finanza.lat
          </Link>
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

function LoginForm({ className, ...props }: React.ComponentPropsWithoutRef<'form'>) {
  const { supabase } = useSupabase();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: '', password: '' },
  });

  useEffect(() => {
    // Check session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.push('/panel'); // Changed from /dashboard to /panel based on your shared code
      }
    });
  }, [router, supabase.auth]);

  const onSubmit = async (values: FormData) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword(values);

      if (error) {
        if (error.message === 'Email not confirmed') {
          router.push(`/verify-email?email=${values.email}`);
        }
        toast.error('Error al iniciar sesión', { description: error.message });
      } else {
        if (data.session?.user?.email_confirmed_at) { // Check for email_confirmed_at instead of confirmed_at
          // Logic to check/create profile can be kept if needed, but might be handled server-side
          // Consider if this client-side profile check/creation is necessary or if it's better elsewhere.
          // For now, keeping it as per your original logic but simplified.
          const { data: existingProfile } = await supabase.from('profiles').select('*').eq('id', data.user.id).single();

          if (!existingProfile) {
            await supabase.from('profiles').insert({
              id: data.user.id,
              email: data.user.email,
              // full_name: data.user.user_metadata.full_name, // user_metadata might not have full_name yet
            });
          }

          toast.success('Sesión iniciada');
          // No need to set user state locally if using Supabase's session
          // localStorage.setItem('user_id', data.session.user.id); // Consider if localStorage is the best place for this
          router.push('/panel'); // Changed from /dashboard to /panel
        } else {
           // Handle cases where session is created but email not confirmed
           // The error check above already covers "Email not confirmed", so this might be redundant.
           // Keeping it simple based on error message for now.
           toast.error("Error al iniciar sesión", { description: "Email not confirmed." });
           router.push(`/verify-email?email=${values.email}`);
        }
      }
    } catch (error: any) {
      // This catch block is more for unexpected errors
      console.error('Login unexpected error', error);
      toast.error('Error inesperado', { description: error.message || 'Ocurrió un error inesperado al iniciar sesión.' });
    } finally {
      setIsLoading(false);
    }
  };

  // Remove the loading state that checks for user and isLoadingSession from the main component
  // The loading state is now handled by the `isLoading` state in the form button
  return (
    <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Iniciar sesión</CardTitle>
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
                          type={showPassword ? 'text' : 'password'}
                          {...field}
                          className="pr-10"
                        />
                      </FormControl>
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
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
                'Entrar'
              )}
            </Button>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isSubmitting}>
              {isSubmitting ? 'Signing In...' : 'Sign In'}
            </Button>
            <p className="text-sm text-muted-foreground">
              Don&apos;t have an account?{' '}
              <Button variant="link" asChild className="p-0 h-auto text-accent">
                <Link href="/auth/signup">Sign Up</Link>
              </Button>
            </p>
          </CardFooter>
        <div className="mt-4 text-center text-sm space-y-1">
          <p>
            ¿Olvidaste tu contraseña?{' '}
            <Link href="/reset-password" className="text-primary hover:underline">
              Recuperar acceso
            </Link>
          </p>
          <p>
            ¿No tienes cuenta?{' '}
            <Link href="/register" className="text-primary hover:underline">
              Crear cuenta
            </Link>
          </p>
        </div>
        </form>
      </Card>
    </div>
  );
}

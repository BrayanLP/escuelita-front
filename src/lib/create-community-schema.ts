// src/schemas/create-community-schema.ts
import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email("Correo inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

export const communitySchema = z.object({
  name: z.string().min(3, "El nombre es requerido"),
  slug: z
    .string()
    .min(3, "El slug debe tener al menos 3 caracteres")
    .regex(/^[a-z0-9-]+$/, "Solo letras minúsculas, números y guiones"),
});

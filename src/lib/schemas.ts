import { z } from "zod";

export const communitySchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  slug: z
    .string()
    .min(1, "El slug es requerido")
    .regex(
      /^[a-z0-9-]+$/,
      "El slug solo puede contener letras minúsculas, números y guiones"
    ),
  description: z.string().min(1, "La descripción es requerida"),
  description_large: z.string().optional(),
  banner_url: z
    .string()
    .url("URL de banner inválida")
    .optional()
    .or(z.literal("")),
  logo_url: z.string().url("URL de logo inválida").optional().or(z.literal("")),
  is_public: z.boolean().default(false),
  price: z.string().optional(),
});

export const profileSchema = z.object({
  full_name: z.string().min(1, "El nombre completo es requerido"),
  email: z.string().email("Email inválido"),
  bio: z.string().optional(),
  avatar_url: z
    .string()
    .url("URL de avatar inválida")
    .optional()
    .or(z.literal("")),
});

export const postSchema = z.object({
  title: z.string().min(1, "El título es requerido"),
  content: z.string().min(1, "El contenido es requerido"),
  category: z.string().optional(),
  pinned: z.boolean().default(false),
});

export const courseSchema = z.object({
  title: z.string().min(1, "El título es requerido"),
  description: z.string().min(1, "La descripción es requerida"),
  community_id: z.string().uuid("ID de comunidad inválido").optional(),
  photo_url: z
    .string()
    .url("URL de foto inválida")
    .optional()
    .or(z.literal("")),
});

export const subscriptionSchema = z.object({
  user_id: z.string().uuid("ID de usuario inválido"),
  community_id: z.string().uuid("ID de comunidad inválido"),
  payment_method_id: z.string().uuid("ID de método de pago inválido"),
  status: z
    .enum(["pending", "active", "cancelled", "expired"])
    .default("pending"),
  notes: z.string().optional(),
});

export const eventSchema = z.object({
  title: z.string().min(1, "El título es requerido"),
  description: z.string().optional(),
  start_time: z.string().min(1, "La fecha de inicio es requerida"),
  end_time: z.string().optional(),
});

export type CommunityFormData = z.infer<typeof communitySchema>;
export type ProfileFormData = z.infer<typeof profileSchema>;
export type PostFormData = z.infer<typeof postSchema>;
export type CourseFormData = z.infer<typeof courseSchema>;
export type SubscriptionFormData = z.infer<typeof subscriptionSchema>;
export type EventFormData = z.infer<typeof eventSchema>;

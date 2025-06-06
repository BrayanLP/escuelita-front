// lib/upload-image.ts
import { supabase } from "@/lib/supabase/client";

export async function uploadImageToStorage(file: File, path: string) {
  const { data, error } = await supabase.storage
    .from("payments") // bucket llamado "payments"
    .upload(path, file, {
      cacheControl: "3600",
      upsert: true,
    });

  if (error) return { error };

  const { data: publicUrl } = supabase.storage
    .from("payments")
    .getPublicUrl(path);

  return { url: publicUrl.publicUrl };
}

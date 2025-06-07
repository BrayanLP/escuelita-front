// utils/slugify.ts
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD") // elimina tildes
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9 -]/g, "") // elimina caracteres no permitidos
    .replace(/\s+/g, "-") // reemplaza espacios por guiones
    .replace(/-+/g, "-") // elimina múltiples guiones
    .replace(/^-+|-+$/g, ""); // elimina guiones al inicio/fin
}

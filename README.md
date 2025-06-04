# 📘 README — Escuelita

Bienvenido a **Escuelita**, una plataforma educativa con comunidad, cursos y colaboración. Si deseas contribuir, aquí tienes todo lo necesario para comenzar. 💡

---

## 🔧 Requisitos

- Node.js 18+
- npm
- Supabase account (ver detalles abajo)
- Editor de código (VSCode recomendado, etc.)

---

## 🖥 Instalación local

```bash
npm install
cp .env.example .env.local
npm run dev
```

Luego, abre `http://localhost:3000`

---

## 📦 Variables de entorno (`.env.local`)

Solicita al equipo el archivo `.env.local`. Si no lo tienes, puedes usar el ejemplo:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=pk_xxx
```

Usamos un entorno Supabase **de desarrollo**, con datos ficticios para seguridad.

---

## 🌿 Estructura del proyecto

```
/app          → rutas Next.js
/components  → componentes UI reutilizables
/hooks       → lógica personalizada (fetch, estado)
/lib         → configuración supabase, helpers
```

---

## 🚀 Scripts útiles

```bash
npm run dev         # ejecuta localmente
npm run build       # compila para producción
npm run lint        # lint de código
```

---

## 🧩 Convención de ramas

- `main`: producción, protegido.
- `develop`: rama base para features.
- `feat/xxx`: nuevas funcionalidades
- `fix/xxx`: corrección de bugs
- `chore/xxx`: tareas menores o de mantenimiento

---

## 📬 Contacto

## Abre este enlace para unirte a mi grupo de WhatsApp: https://chat.whatsapp.com/FfFyPybtybuLbutHcp2y7Z

## 🤝 Contribuir

Consulta el archivo [`CONTRIBUTING.md`](./CONTRIBUTING.md) para más detalles.

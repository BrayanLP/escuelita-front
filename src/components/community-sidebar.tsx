"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";

export function CommunitySidebar() {
  return (
    <div className="bg-white rounded-lg shadow p-4 space-y-3">
      <img
        src={"https://i.ibb.co/RpKCSR7j/fff.png"}
        alt="Comunidad"
        width={280}
        height={160}
        className="rounded w-full"
      />
      <h2 className="text-lg font-semibold">AI Accelerator</h2>
      <p className="text-sm text-muted-foreground">
        Una comunidad para dominar agentes de IA y automatización.
      </p>

      <ul className="text-sm space-y-1 mt-2">
        <li>👥 6.1k miembros</li>
        <li>🟢 52 en línea</li>
        <li>🛡️ 2 administradores</li>
      </ul>

      <Button className="w-full mt-4">Invitar personas</Button>
    </div>
  );
}

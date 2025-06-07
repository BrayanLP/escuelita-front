"use client";
import Image from "next/image";
import Link from "next/link";
import logo from "../app/assets/images/logo.png";
import { useAuth } from "@/context/auth-provider";
import { Button } from "./ui/button";
const NavHome = () => {
  const { user } = useAuth();
  return (
    <header className="flex items-center justify-between px-6 py-4 border-b bg-white">
      <div className="flex items-center gap-4">
        <Link href="/" className="font-bold text-xl flex items-center gap-2">
          <Image src={logo} width={40} alt="Logo" />
          Escuelita.lat
        </Link>
      </div>
      <div>
        {user?.id ? (
          <Button variant="outline" size="sm">
            <Link href={"/auth/login"}>{user?.email?.split("@")[0]}</Link>
          </Button>
        ) : (
          <Button variant="outline" size="sm">
            <Link href={"/auth/login"}>INGRESAR</Link>
          </Button>
        )}
      </div>
    </header>
  );
};

export default NavHome;

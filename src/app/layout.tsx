import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/app/components/Navbar";
import { Footer } from "@/app/components/Footer";
import { Toaster } from "@/components/ui/toaster";
import { SupabaseProvider } from "@/context/SupabaseContext";
import { AuthProvider } from "@/context/auth-provider";

export const metadata: Metadata = {
  title: "Escuelita - Online Learning Platform",
  description: "Explore a variety of courses and join our learning community.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased flex flex-col min-h-screen">
        <SupabaseProvider>
          <AuthProvider>
            {/* <Navbar /> */}
            <main className="">{children}</main>
            <Footer />
            <Toaster />
          </AuthProvider>
        </SupabaseProvider>
      </body>
    </html>
  );
}

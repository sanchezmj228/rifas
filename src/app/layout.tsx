import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ContactFloatingButton from "@/components/ContactFloatingButton";

export const metadata: Metadata = {
  title: "RifasDoradas - Tu Suerte Comienza Aquí",
  description: "Participa en rifas de productos premium. iPhone, PlayStation, MacBook y más. ¡Elige tu número de la suerte!",
  keywords: "rifas, sorteos, premios, iPhone, PlayStation, MacBook, suerte",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="casino-bg antialiased min-h-screen flex flex-col relative">
        <Header />
        <main className="flex-1 pt-16 md:pt-20">
          {children}
        </main>
        <Footer />
        <ContactFloatingButton />
      </body>
    </html>
  );
}

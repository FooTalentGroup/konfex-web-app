import type { Metadata } from "next";
import { lato, poppins } from "./fonts";
import "./styles/globals.css";
import ToastProvider from "@/components/providers/ToastProvider";
import { UnsavedChangesProvider } from "@/contexts/UnsavedChangesContext";

export const metadata: Metadata = {
  title: "KONFEX",
  description: "Sistema de gestión para EOS Indumentaria",
  icons: {
    icon: "/Isotipo.svg",
    shortcut: "/Isotipo.svg",
    apple: "/Isotipo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${lato.variable} ${poppins.variable} ${lato.className} antialiased`}
        suppressHydrationWarning
      >
        <UnsavedChangesProvider>
          <ToastProvider>{children}</ToastProvider>
        </UnsavedChangesProvider>
      </body>
    </html>
  );
}

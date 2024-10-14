import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import AOSInit from "@/utils/AOSInit";
import "aos/dist/aos.css";
import { AuthProvider } from "@/context/AuthContext";

const damnFont = localFont({
  src: "../assets/fonts/Product Sans Regular.ttf",
  variable: "--font-product-sans",
  weight: "400",
});

export const metadata: Metadata = {
  title: "elvish does",
  description: "just another useless project!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
      <html lang="en">
        <head>
          <link rel="icon" href="/favicon.png" type="image/png" sizes="any" />
        </head>
        <AOSInit />
        <body className={`${damnFont.variable} antialiased`}>{children}</body>
      </html>
    </AuthProvider>
  );
}

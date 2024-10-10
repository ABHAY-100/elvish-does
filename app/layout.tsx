import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import AOSInit from '@/utils/AOSInit';
import 'aos/dist/aos.css';
import { AuthProvider } from '@/context/AuthContext';

const damnFont = localFont({
  src: "./fonts/MouseMemoirs.ttf",
  variable: "--font-mouse-memoirs",
  weight: "400",
});

export const metadata: Metadata = {
  title: "elvish has aura",
  description: "Just another Useless Project!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
      <html lang="en">
      <AOSInit />
      <body
        className={`${damnFont.variable} antialiased`}
      >
        {children}
      </body>
    </html>
    </AuthProvider>
  );
}

import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const damnFont = localFont({
  src: "./fonts/Satoshi-Variable.woff2",
  variable: "--font-satoshi",
  weight: "100 200 300 400 500 600 700 800 900",
});
const damnFontItalic = localFont({
  src: "./fonts/Satoshi-VariableItalic.woff2",
  variable: "--font-satoshi-italic",
  weight: "100 200 300 400 500 600 700 800 900",
});

export const metadata: Metadata = {
  title: "Elvish Aura",
  description: "Just another Useless Project!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${damnFont.variable} ${damnFontItalic.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

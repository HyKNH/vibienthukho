import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@fontsource/cactus-classical-serif";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const nomNaTong = localFont({
  src: "./fonts/NomNaTong.woff",
  variable: "--font-nomnatong",
  weight: "400",
});

export const metadata: Metadata = {
  title: "Vi Biên thư khố 韋編書庫",
  description: "a small Vietnamese Hán Nôm digital library",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${nomNaTong.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import '@fontsource/cactus-classical-serif';
import "./styles/globals.css";
import { Header } from "./components/Header/Header";
import { ColorSchemeScript, MantineProvider, mantineHtmlProps } from "@mantine/core";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
    <html lang="en" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <MantineProvider>
        <Header/>{children}</MantineProvider>
      </body>
    </html>
  );
}

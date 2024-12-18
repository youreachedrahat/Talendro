import "@/styles/globals.css";
import { Metadata, Viewport } from "next";
import clsx from "clsx";

import { Providers } from "./providers";

import { siteConfig } from "@/config/site";
import { fontSans, fontComfortaa } from "@/config/fonts";
import { Navbar } from "@/components/navbar";
import dynamic from "next/dynamic";
// const LucidProvider = dynamic(() => import('./LucidProvider'))
import {LucidProvider} from "./LucidProvider";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html suppressHydrationWarning lang="en">
      <head />
        <body className={clsx(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable,
          fontComfortaa.variable
        )}>
      <Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>
          <LucidProvider>
            <Navbar />
            <div className="relative flex flex-col h-screen">
              <main className="container mx-auto  flex-grow">{children}</main>
            </div>
          </LucidProvider>
      </Providers>
        </body>
    </html>
  );
}
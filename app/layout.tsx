import type { Metadata } from "next";
import { Schibsted_Grotesk, Martian_Mono } from "next/font/google";
import "./globals.css";
import FloatingLines from "@/components/ui/FloatingLines";
import Navbar from "@/components/Navbar";


const schibstedGrotesk = Schibsted_Grotesk({
  variable: "--font-schibsted-grotesk",
  subsets: ["latin"],
});

const martianMono = Martian_Mono({
  variable: "--font-martian-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GameDevEvent",
  description: "Hub for Every Game dev event you should not miss!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${schibstedGrotesk.variable} ${martianMono.variable} antialiased`}
      >
        <Navbar></Navbar>

        <div className="fixed inset-0 z-0 pointer-events-none">
        <FloatingLines
          enabledWaves={['top', 'middle', 'bottom']}
          // Array - specify line count per wave; Number - same count for all waves
          lineCount={[10, 15, 20]}
          // Array - specify line distance per wave; Number - same distance for all waves
          lineDistance={[8, 6, 4]}
          bendRadius={5.0}
          bendStrength={-0.5}
          interactive={true}
          parallax={true}
        />
        </div>
        <main className="relative z-10">
          {children}
        </main>
      </body>
    </html>
  );
}

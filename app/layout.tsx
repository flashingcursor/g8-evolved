import type { Metadata } from "next";
import Navigation from "@/components/Navigation";
import "./globals.css";

export const metadata: Metadata = {
  title: "Yamaha G8 Golf Cart Conversion - Documentation",
  description: "Complete guide and interactive documentation for upgrading Yamaha G8 golf cart electronics",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen flex flex-col">
        <Navigation />
        <main className="container mx-auto px-4 py-6 md:px-8 md:py-8 flex-grow">
          {children}
        </main>
        <footer className="bg-gray-800 text-white text-center p-4 mt-auto">
          <p className="text-sm md:text-base">&copy; 2025 G8 Evolved - Yamaha G8 Conversion Project</p>
        </footer>
      </body>
    </html>
  );
}

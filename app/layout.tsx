import type { Metadata } from "next";
import Link from "next/link";
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
      <body className="antialiased">
        <nav className="bg-gray-800 text-white p-4">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-2xl font-bold">G8 Evolved</h1>
            <ul className="flex space-x-6">
              <li><Link href="/" className="hover:text-blue-400">Home</Link></li>
              <li><Link href="/wiring" className="hover:text-blue-400">Wiring Diagrams</Link></li>
              <li><Link href="/components" className="hover:text-blue-400">Components</Link></li>
              <li><Link href="/guide" className="hover:text-blue-400">Build Guide</Link></li>
            </ul>
          </div>
        </nav>
        <main className="container mx-auto p-8">
          {children}
        </main>
        <footer className="bg-gray-800 text-white text-center p-4 mt-12">
          <p>&copy; 2025 G8 Evolved - Yamaha G8 Conversion Project</p>
        </footer>
      </body>
    </html>
  );
}

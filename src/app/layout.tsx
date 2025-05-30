import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-inter",
});

export const metadata: Metadata = {
    title: "Bdic Virtual market",
    description: "A virtual market and logistics management system",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en">
        <body className={`${inter.variable} antialiased`}>
        <CartProvider>
            <main className="min-h-screen">{children}</main>
        </CartProvider>
        </body>
        </html>
    );
}
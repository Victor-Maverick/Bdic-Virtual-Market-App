import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

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
        <main className="min-h-screen">{children}</main>
        </body>
        </html>
    );
}

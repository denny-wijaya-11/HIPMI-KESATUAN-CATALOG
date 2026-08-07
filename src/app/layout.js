import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AntiInspect from "@/components/AntiInspect";
import { CartProvider } from "@/context/CartContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "HIPMORA",
  description: "Platform Katalog Resmi HIPMORA",
  icons: {
    icon: '/images/MASKOT LOGO.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AntiInspect />
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}

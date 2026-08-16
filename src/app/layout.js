import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AntiInspect from "@/components/AntiInspect";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";

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
  manifest: "/manifest.json",
  icons: {
    icon: '/images/LOGO.png',
    apple: '/images/LOGO.png',
  },
};

export const viewport = {
  themeColor: '#dc2626',
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AntiInspect />
        <WishlistProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </WishlistProvider>
      </body>
    </html>
  );
}

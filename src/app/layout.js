import { Plus_Jakarta_Sans, Geist_Mono } from "next/font/google";
import "./globals.css";
import AntiInspect from "@/components/AntiInspect";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "HIPMORA",
  description: "Platform Katalog Resmi HIPMORA — Ekosistem Pengusaha Muda",
  manifest: "/manifest.json",
  icons: {
    icon: '/images/LOGO.png',
    apple: '/images/LOGO.png',
  },
};

export const viewport = {
  themeColor: '#C62828',
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="id"
      className={`${jakarta.variable} ${geistMono.variable} h-full antialiased`}
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

import { Plus_Jakarta_Sans, Geist_Mono } from "next/font/google";
import "./globals.css";
import AntiInspect from "@/components/AntiInspect";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import MobileBottomNav from "@/components/mobile/MobileBottomNav";
import PushNotificationHandler from "@/components/mobile/PushNotificationHandler";
import MobileUXEnhancer from "@/components/mobile/MobileUXEnhancer";
import PullToRefresh from "@/components/mobile/PullToRefresh";
import OnlineTracker from "@/components/public/OnlineTracker";
import AIChatbot from "@/components/public/AIChatbot";

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
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="id"
      className={`${jakarta.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col pb-16 md:pb-0 overflow-x-hidden w-full">
        <AntiInspect />
        <PushNotificationHandler />
        <MobileUXEnhancer />
        <OnlineTracker />
        <WishlistProvider>
          <CartProvider>
            <PullToRefresh>
              {children}
            </PullToRefresh>
            <MobileBottomNav />
          </CartProvider>
        </WishlistProvider>
        <AIChatbot />
      </body>
    </html>
  );
}

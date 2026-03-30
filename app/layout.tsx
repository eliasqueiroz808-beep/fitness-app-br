import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Protocolo 5% - Seu App de Fitness",
  description: "Transforme seu corpo com treinos e nutrição personalizados",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Protocolo 5%",
  },
};

export const viewport: Viewport = {
  themeColor: "#0D0D0D",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // suppressHydrationWarning prevents React mismatch warning when the theme
    // init script adds the "light" class before hydration.
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        {/* Runs synchronously before first paint — prevents flash of wrong theme */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if(localStorage.getItem('fitbr_theme')==='light')document.documentElement.classList.add('light')}catch(e){}`,
          }}
        />
      </head>
      <body>
        <div className="relative mx-auto min-h-screen max-w-md overflow-x-hidden">
          {children}
        </div>
      </body>
    </html>
  );
}

import { Geist_Mono, Inter } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Navbar1 } from "@/components/navbar1";
import Footer from "@/components/footer";
import { cn } from "@/lib/utils";
import { AuthProvider } from "@/lib/contexts/AuthContext";

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata = {
  title: "UniWeek",
  description: "Organize your class schedule",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("antialiased", fontMono.variable, "font-sans", inter.variable)}
    >
      <body>
        <TooltipProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <AuthProvider>
              <Navbar1 />
              {children}
              <Footer />
            </AuthProvider>
          </ThemeProvider>
        </TooltipProvider>
      </body>
    </html>
  )
}

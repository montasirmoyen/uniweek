import type { Metadata } from "next";
import { Onest } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/contexts/AuthContext";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const onest = Onest({
  variable: "--font-onest",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "UniWeek - Schedule Organizer",
  description: "Organize and maximize your class schedule",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${onest.variable} antialiased`}
      >
        <AuthProvider>
          <Navigation />
          {children}
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}

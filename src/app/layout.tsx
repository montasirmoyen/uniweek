import type { Metadata } from "next";
import { Onest } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/contexts/AuthContext";
import Navigation from "@/components/Navigation";

const onest = Onest({
  variable: "--font-onest",
  subsets: ["latin"],
});


export const metadata: Metadata = {
  title: "Suffolk Schedule - Organize & Aestheticize Your Classes",
  description: "Help Suffolk University students organize and aestheticize their class schedule",
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
        </AuthProvider>
      </body>
    </html>
  );
}

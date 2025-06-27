import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import SupabaseProvider from "@/providers/SupabaseProvider";
import UserProvider from "@/providers/UserProvider";   
import { ThemeProvider } from '@/providers/ThemeProvider'; 

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Codify LMS",
  description: "Learn and grow with Codify LMS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="" suppressHydrationWarning>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap" rel="stylesheet"/>
      </head>
      <body className={`${poppins.variable}`}>
        <ThemeProvider>
        <SupabaseProvider>
          <UserProvider>
            {children}
          </UserProvider>
        </SupabaseProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
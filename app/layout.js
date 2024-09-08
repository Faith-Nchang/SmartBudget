import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme_provider";
import {ClerkProvider} from '@clerk/nextjs'
import { Analytics } from "@vercel/analytics/react"

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Budgeting app",
  description: "Final Project for Track A",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>

    <html lang="en">
      <body className={inter.className}>
      <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Analytics />
        </ThemeProvider>
        </body>
    </html>
    </ClerkProvider>
  );
}

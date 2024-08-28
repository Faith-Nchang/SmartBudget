import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme_provider";


const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Budgeting app",
  description: "Final Project for Track A",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
      <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
           
        </ThemeProvider>
        </body>
    </html>
  );
}

"use client"

import { store } from "@/store/store"
import { Provider } from "react-redux"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import AuthProvider from "@/shared/components/AuthProvider"
import Sidebar from "@/shared/components/Sidebar"
import { usePathname } from "next/navigation"
import { Playfair_Display, Inter } from "next/font/google"
import "./globals.css"

const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" })
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })

function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAuthPage = pathname === "/login" || pathname === "/verify-2fa"

  return (
    <div className="flex min-h-screen">
      {!isAuthPage && <Sidebar />}
      <div className="flex-1 bg-[#faf7f4]">
        {children}
      </div>
    </div>
  )
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body>
        <Provider store={store}>
          <AuthProvider>
            <AppLayout>{children}</AppLayout>
            <ToastContainer position="top-right" autoClose={3000} />
          </AuthProvider>
        </Provider>
      </body>
    </html>
  )
}
"use client"

import { useEffect, useState } from "react"
import { useAppDispatch } from "@/store/hooks"
import { setAdmin } from "@/features/auth/authSlice"
import { authService } from "@/features/auth/authService"

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch()
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("crm_token")
    if (!token) {
      setChecking(false)
      return
    }
    authService.me()
      .then((res) => dispatch(setAdmin(res.data.data)))
      .catch(() => localStorage.removeItem("crm_token"))
      .finally(() => setChecking(false))
  }, [dispatch])

  if (checking) return (
    <div className="min-h-screen flex items-center justify-center bg-[#faf7f4]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-[#c9a96e] border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-gray-400 tracking-[0.2em] uppercase">Loading</p>
      </div>
    </div>
  )

  return <>{children}</>
}
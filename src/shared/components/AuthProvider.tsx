"use client"

import { useEffect } from "react"
import { useAppDispatch } from "@/store/hooks"
import { setAdmin } from "@/features/auth/authSlice"
import { authService } from "@/features/auth/authService"

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch()

  useEffect(() => {
    const token = localStorage.getItem("crm_token")
    if (!token) return
    authService.me()
      .then((res) => dispatch(setAdmin(res.data.data)))
      .catch(() => localStorage.removeItem("crm_token"))
  }, [dispatch])

  return <>{children}</>
}
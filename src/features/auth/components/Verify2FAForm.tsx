"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAppDispatch } from "@/store/hooks"
import { setAdmin } from "../authSlice"
import { authService } from "../authService"
import { toast } from "react-toastify"

export default function Verify2FAForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get("email") || ""
  const dispatch = useAppDispatch()
  const [code, setCode] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await authService.verify2fa({ email, code })
      const token = res.data.data.token
      localStorage.setItem("crm_token", token)
      const meRes = await authService.me()
      dispatch(setAdmin(meRes.data.data))
      toast.success("Welcome, Admin!")
      router.push("/dashboard")
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Invalid code")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <input
        placeholder="6-digit code"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-center tracking-[0.5em] font-mono focus:outline-none focus:border-[#c9a96e] transition placeholder:tracking-normal placeholder:font-sans"
        maxLength={6}
        required
      />
      <button type="submit" disabled={loading} className="mt-2 bg-[#1a1a1a] text-white py-3.5 rounded-full hover:bg-[#c9a96e] transition text-sm font-medium tracking-wider disabled:opacity-50">
        {loading ? "Verifying..." : "VERIFY"}
      </button>
    </form>
  )
}
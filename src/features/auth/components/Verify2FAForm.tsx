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
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-sm">
      <input
        placeholder="Enter 2FA code"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        className="border p-2 rounded"
        required
      />
      <button
        type="submit"
        disabled={loading}
        className="bg-black text-white p-2 rounded hover:bg-gray-800 disabled:opacity-50"
      >
        {loading ? "Verifying..." : "Verify"}
      </button>
    </form>
  )
}
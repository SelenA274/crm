"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { authService } from "../authService"
import { toast } from "react-toastify"

const inputClass = "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:border-[#c9a96e] transition placeholder:text-gray-300"

export default function AdminLoginForm() {
  const router = useRouter()
  const [form, setForm] = useState({ email: "", password: "" })
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await authService.adminLogin(form)
      toast.success("2FA code sent to your email!")
      router.push(`/verify-2fa?email=${form.email}`)
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Login failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <input name="email" type="email" placeholder="Admin email" value={form.email} onChange={handleChange} className={inputClass} required />
      <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} className={inputClass} required />
      <button type="submit" disabled={loading} className="mt-2 bg-[#1a1a1a] text-white py-3.5 rounded-full hover:bg-[#c9a96e] transition text-sm font-medium tracking-wider disabled:opacity-50">
        {loading ? "Verifying..." : "SIGN IN"}
      </button>
    </form>
  )
}
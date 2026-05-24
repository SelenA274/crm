"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { authService } from "../authService"
import { toast } from "react-toastify"

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
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-sm">
      <input
        name="email"
        type="email"
        placeholder="Admin Email"
        value={form.email}
        onChange={handleChange}
        className="border p-2 rounded"
        required
      />
      <input
        name="password"
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={handleChange}
        className="border p-2 rounded"
        required
      />
      <button
        type="submit"
        disabled={loading}
        className="bg-black text-white p-2 rounded hover:bg-gray-800 disabled:opacity-50"
      >
        {loading ? "Loading..." : "Login"}
      </button>
    </form>
  )
}
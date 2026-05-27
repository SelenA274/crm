"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAppSelector } from "@/store/hooks"
import api from "@/lib/axios"
import { toast } from "react-toastify"
import { Trash2 } from "lucide-react"

export default function UsersPage() {
  const { isAuthenticated } = useAppSelector((state) => state.auth)
  const router = useRouter()
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const token = typeof window !== "undefined" ? localStorage.getItem("crm_token") : null
  const config = { headers: { Authorization: `Bearer ${token}` } }

  useEffect(() => {
    if (!isAuthenticated) { router.push("/login"); return }
    api.get("/users", config)
      .then((res) => setUsers(res.data.data || []))
      .catch(() => toast.error("Failed to load users"))
      .finally(() => setLoading(false))
  }, [isAuthenticated])

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/users/${id}`, config)
      setUsers(users.filter((u) => u._id !== id))
      toast.success("User deleted")
    } catch { toast.error("Failed to delete user") }
  }

  const handleRoleUpdate = async (id: string, role: string) => {
    try {
      await api.put(`/users/${id}/role`, { role }, config)
      setUsers(users.map((u) => u._id === id ? { ...u, role } : u))
      toast.success("Role updated")
    } catch { toast.error("Failed to update role") }
  }

  if (loading) return <main className="px-8 py-10"><p className="text-gray-400">Loading...</p></main>

  return (
    <main className="px-8 py-10">
      <div className="mb-10">
        <p className="text-[#c9a96e] text-xs tracking-[0.3em] uppercase mb-2">Manage</p>
        <h1 className="font-serif text-4xl text-gray-900">Users</h1>
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left px-6 py-4 text-xs text-gray-400 uppercase tracking-wider font-medium">Name</th>
              <th className="text-left px-6 py-4 text-xs text-gray-400 uppercase tracking-wider font-medium">Email</th>
              <th className="text-left px-6 py-4 text-xs text-gray-400 uppercase tracking-wider font-medium">Role</th>
              <th className="text-left px-6 py-4 text-xs text-gray-400 uppercase tracking-wider font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, i) => (
              <tr key={user._id} className={`border-b border-gray-50 hover:bg-[#faf7f4] transition ${i === users.length - 1 ? "border-0" : ""}`}>
                <td className="px-6 py-4 font-medium text-gray-900 text-sm">{user.name}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{user.email}</td>
                <td className="px-6 py-4">
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleUpdate(user._id, e.target.value)}
                    className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:border-[#c9a96e] transition"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td className="px-6 py-4">
                  <button onClick={() => handleDelete(user._id)} className="text-gray-300 hover:text-red-400 transition">
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  )
}
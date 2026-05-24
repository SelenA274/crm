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
    } catch {
      toast.error("Failed to delete user")
    }
  }

  const handleRoleUpdate = async (id: string, role: string) => {
    try {
      await api.put(`/users/${id}/role`, { role }, config)
      setUsers(users.map((u) => u._id === id ? { ...u, role } : u))
      toast.success("Role updated")
    } catch {
      toast.error("Failed to update role")
    }
  }

  if (loading) return <p className="text-center mt-10">Loading...</p>

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Users</h1>
      <div className="border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-4 text-sm font-semibold">Name</th>
              <th className="text-left p-4 text-sm font-semibold">Email</th>
              <th className="text-left p-4 text-sm font-semibold">Role</th>
              <th className="text-left p-4 text-sm font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="border-t">
                <td className="p-4">{user.name}</td>
                <td className="p-4">{user.email}</td>
                <td className="p-4">
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleUpdate(user._id, e.target.value)}
                    className="border p-1 rounded text-sm"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td className="p-4">
                  <button
                    onClick={() => handleDelete(user._id)}
                    className="text-red-500 hover:text-red-700"
                  >
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
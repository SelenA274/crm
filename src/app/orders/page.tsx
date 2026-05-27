"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAppSelector } from "@/store/hooks"
import api from "@/lib/axios"
import { toast } from "react-toastify"

const statusColors: Record<string, string> = {
  pending:    "bg-yellow-50 text-yellow-600",
  processing: "bg-blue-50 text-blue-600",
  shipped:    "bg-purple-50 text-purple-600",
  delivered:  "bg-green-50 text-green-600",
  cancelled:  "bg-red-50 text-red-400",
}

export default function OrdersPage() {
  const { isAuthenticated } = useAppSelector((state) => state.auth)
  const router = useRouter()
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const token = typeof window !== "undefined" ? localStorage.getItem("crm_token") : null
  const config = { headers: { Authorization: `Bearer ${token}` } }

  useEffect(() => {
    if (!isAuthenticated) { router.push("/login"); return }
    api.get("/order", config)
      .then((res) => setOrders(res.data.data || []))
      .catch(() => toast.error("Failed to load orders"))
      .finally(() => setLoading(false))
  }, [isAuthenticated])

  const handleStatusUpdate = async (id: string, orderStatus: string) => {
    try {
      await api.put(`/order/${id}/status`, { orderStatus }, config)
      setOrders(orders.map((o) => o._id === id ? { ...o, orderStatus } : o))
      toast.success("Status updated")
    } catch { toast.error("Failed to update status") }
  }

  if (loading) return <main className="px-8 py-10"><p className="text-gray-400">Loading...</p></main>

  return (
    <main className="px-8 py-10">
      <div className="mb-10">
        <p className="text-[#c9a96e] text-xs tracking-[0.3em] uppercase mb-2">Manage</p>
        <h1 className="font-serif text-4xl text-gray-900">Orders</h1>
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left px-6 py-4 text-xs text-gray-400 uppercase tracking-wider font-medium">Order ID</th>
              <th className="text-left px-6 py-4 text-xs text-gray-400 uppercase tracking-wider font-medium">Total</th>
              <th className="text-left px-6 py-4 text-xs text-gray-400 uppercase tracking-wider font-medium">Status</th>
              <th className="text-left px-6 py-4 text-xs text-gray-400 uppercase tracking-wider font-medium">Update</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, i) => (
              <tr key={order._id} className={`border-b border-gray-50 hover:bg-[#faf7f4] transition ${i === orders.length - 1 ? "border-0" : ""}`}>
                <td className="px-6 py-4 text-sm font-mono text-gray-500">#{order._id.slice(-8)}</td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">${order.totalPrice}</td>
                <td className="px-6 py-4">
                  <span className={`text-xs px-3 py-1 rounded-full font-medium capitalize ${statusColors[order.orderStatus] || "bg-gray-100 text-gray-600"}`}>
                    {order.orderStatus}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <select
                    value={order.orderStatus}
                    onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                    className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:border-[#c9a96e] transition"
                  >
                    {["pending","processing","shipped","delivered","cancelled"].map((s) => (
                      <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  )
}
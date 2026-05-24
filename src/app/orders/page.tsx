"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAppSelector } from "@/store/hooks"
import api from "@/lib/axios"
import { toast } from "react-toastify"

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
    } catch {
      toast.error("Failed to update status")
    }
  }

  if (loading) return <p className="text-center mt-10">Loading...</p>

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Orders</h1>
      <div className="border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-4 text-sm font-semibold">Order ID</th>
              <th className="text-left p-4 text-sm font-semibold">Total</th>
              <th className="text-left p-4 text-sm font-semibold">Status</th>
              <th className="text-left p-4 text-sm font-semibold">Update</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id} className="border-t">
                <td className="p-4 text-sm">#{order._id.slice(-8)}</td>
                <td className="p-4">${order.totalPrice}</td>
                <td className="p-4">
                  <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm">
                    {order.orderStatus}
                  </span>
                </td>
                <td className="p-4">
                  <select
                    value={order.orderStatus}
                    onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                    className="border p-1 rounded text-sm"
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
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
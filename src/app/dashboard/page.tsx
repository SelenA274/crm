"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAppSelector } from "@/store/hooks"
import api from "@/lib/axios"
import { toast } from "react-toastify"
import { ShoppingBag, Users, Package, DollarSign } from "lucide-react"

export default function DashboardPage() {
  const { isAuthenticated } = useAppSelector((state) => state.auth)
  const router = useRouter()
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalUsers: 0,
    totalProducts: 0,
    totalRevenue: 0,
  })

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
      return
    }
    const fetchStats = async () => {
        const token = localStorage.getItem("crm_token")
        const config = { headers: { Authorization: `Bearer ${token}` } }
        try {
          const [ordersRes, usersRes, productsRes] = await Promise.all([
            api.get("/order", config),
            api.get("/users", config),
            api.get("/product", config),
          ])
          const orders = ordersRes.data.data || []
          const users = usersRes.data.data || []
          const products = productsRes.data.data || productsRes.data || []
          const revenue = orders.reduce((sum: number, o: any) => sum + (o.totalPrice || 0), 0)
          setStats({
            totalOrders: orders.length,
            totalUsers: users.length,
            totalProducts: products.length,
            totalRevenue: revenue,
          })
        } catch {
          toast.error("Failed to load stats")
        }
      }
    fetchStats()
  }, [isAuthenticated, router])

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="border rounded-lg p-6 flex items-center gap-4">
          <ShoppingBag size={32} />
          <div>
            <p className="text-sm text-gray-500">Total Orders</p>
            <p className="text-2xl font-bold">{stats.totalOrders}</p>
          </div>
        </div>
        <div className="border rounded-lg p-6 flex items-center gap-4">
          <Users size={32} />
          <div>
            <p className="text-sm text-gray-500">Total Users</p>
            <p className="text-2xl font-bold">{stats.totalUsers}</p>
          </div>
        </div>
        <div className="border rounded-lg p-6 flex items-center gap-4">
          <Package size={32} />
          <div>
            <p className="text-sm text-gray-500">Total Products</p>
            <p className="text-2xl font-bold">{stats.totalProducts}</p>
          </div>
        </div>
        <div className="border rounded-lg p-6 flex items-center gap-4">
          <DollarSign size={32} />
          <div>
            <p className="text-sm text-gray-500">Total Revenue</p>
            <p className="text-2xl font-bold">${stats.totalRevenue}</p>
          </div>
        </div>
      </div>
    </main>
  )
}
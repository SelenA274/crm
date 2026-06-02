"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAppSelector } from "@/store/hooks"
import api from "@/lib/axios"
import { toast } from "react-toastify"
import { ShoppingBag, Users, Package, DollarSign, AlertTriangle, Plus, UserPlus, ShoppingCart } from "lucide-react"
import Link from "next/link"
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from "recharts"

const statCards = [
  { key: "totalOrders", label: "Total Orders", icon: ShoppingBag, color: "bg-[#fde8ed] text-[#c97a8f]", href: "/orders" },
  { key: "totalUsers", label: "Total Users", icon: Users, color: "bg-[#faf0e6] text-[#c9a96e]", href: "/users" },
  { key: "totalProducts", label: "Total Products", icon: Package, color: "bg-[#f0f4ff] text-[#7a8fc9]", href: "/products" },
  { key: "totalRevenue", label: "Total Revenue", icon: DollarSign, color: "bg-[#f0faf4] text-[#5a9c7a]", href: "/orders" },
]

const statusColors: Record<string, string> = {
  pending: "bg-yellow-50 text-yellow-600",
  processing: "bg-blue-50 text-blue-600",
  shipped: "bg-purple-50 text-purple-600",
  delivered: "bg-green-50 text-green-600",
  cancelled: "bg-red-50 text-red-400",
}

type TimeFilter = "today" | "week" | "month"

function timeAgo(date: string) {
  const diff = Math.floor((Date.now() - new Date(date).getTime()) / 1000)
  if (diff < 60) return `${diff}s ago`
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

function filterOrders(orders: any[], filter: TimeFilter) {
  const now = new Date()
  return orders.filter((o) => {
    const d = new Date(o.createdAt)
    if (filter === "today") return d.toDateString() === now.toDateString()
    if (filter === "week") { const w = new Date(); w.setDate(now.getDate() - 7); return d >= w }
    if (filter === "month") { const m = new Date(); m.setMonth(now.getMonth() - 1); return d >= m }
    return true
  })
}

function generateRevenueData(orders: any[], filter: TimeFilter): { date: string; revenue: number; fullHour?: number; fullDate?: string }[] {
  if (filter === "today") {
    const hours = Array.from({ length: 8 }, (_, i) => ({ date: `${i * 3}:00`, revenue: 0, fullHour: i * 3 }))
    orders.forEach((o) => {
      const h = new Date(o.createdAt).getHours()
      const slot = hours.find((s) => h >= s.fullHour && h < s.fullHour + 3)
      if (slot) slot.revenue += o.totalPrice || 0
    })
    return hours
  }
  const days = filter === "week" ? 7 : 30
  const slots = Array.from({ length: days }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (days - 1 - i))
    return { date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }), fullDate: d.toDateString(), revenue: 0 }
  })
  orders.forEach((o) => {
    const od = new Date(o.createdAt).toDateString()
    const slot = slots.find((s) => s.fullDate === od)
    if (slot) slot.revenue += o.totalPrice || 0
  })
  return slots
}

function buildActivityLog(orders: any[], users: any[], lowStock: any[]) {
  const activities: { id: string; type: "order" | "user" | "stock"; text: string; date: string }[] = []

  orders.slice(-5).reverse().forEach((o) => {
    const name = o.user?.name || o.shippingAddress?.fullName || "Someone"
    activities.push({ id: o._id, type: "order", text: `New order #${o._id.slice(-6)} placed by ${name}`, date: o.createdAt })
  })

  users.slice(-3).reverse().forEach((u) => {
    activities.push({ id: u._id, type: "user", text: `${u.name} registered a new account`, date: u.createdAt })
  })

  lowStock.forEach((p) => {
    const stock =
      p.variants?.reduce(
        (sum: number, v: any) => sum + (v.stock || 0),
        0
      ) ?? 0
  
    activities.push({
      id: p._id,
      type: "stock",
      text: `"${p.name}" is running low (${stock} left)`,
      date: new Date().toISOString(),
    })
  })

  return activities
    .filter((a) => a.date)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 10)
}

export default function DashboardPage() {
  const { isAuthenticated } = useAppSelector((state) => state.auth)
  const router = useRouter()
  const [allOrders, setAllOrders] = useState<any[]>([])
  const [allProducts, setAllProducts] = useState<any[]>([])
  const [allUsers, setAllUsers] = useState<any[]>([])
  const [filter, setFilter] = useState<TimeFilter>("week")
  const [lowStock, setLowStock] = useState<any[]>([])

  useEffect(() => {
    if (!isAuthenticated) { router.push("/login"); return }
    const fetch = async () => {
      const token = localStorage.getItem("crm_token")
      const config = { headers: { Authorization: `Bearer ${token}` } }
      try {
        const [oR, uR, pR] = await Promise.all([
          api.get("/order", config),
          api.get("/users", config),
          api.get("/product?page=1", config)
        ])
        const orders = oR.data.data || []
        const users = uR.data.data || []
        const products = pR.data.data || pR.data || []
        setAllOrders(orders); setAllUsers(users); setAllProducts(products)
        setLowStock(
          products.filter((p: any) => {
            const stock =
              p.variants?.reduce(
                (sum: number, v: any) => sum + (v.stock || 0),
                0
              ) ?? 0

            return stock < 3
          })
        )
      } catch { toast.error("Failed to load stats") }
    }
    fetch()
  }, [isAuthenticated, router])

  const filtered = filterOrders(allOrders, filter)
  const revenue = filtered.reduce((s: number, o: any) => s + (o.totalPrice || 0), 0)
  const revenueData = generateRevenueData(filtered, filter)
  const recentOrders = [...allOrders].reverse().slice(0, 5)
  const activityLog = buildActivityLog(allOrders, allUsers, lowStock)

  const stats = {
    totalOrders: filtered.length,
    totalUsers: allUsers.length,
    totalProducts: allProducts.length,
    totalRevenue: revenue,
  }

  const filterLabels: Record<TimeFilter, string> = { today: "Today", week: "This Week", month: "This Month" }

  return (
    <main className="px-8 py-10 space-y-8">

      <div className="flex justify-between items-end">
        <div>
          <p className="text-[#c9a96e] text-xs tracking-[0.3em] uppercase mb-2">Overview</p>
          <h1 className="font-serif text-4xl text-gray-900">Dashboard</h1>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as TimeFilter)}
            className="text-sm border border-gray-200 rounded-full px-4 py-2 bg-white focus:outline-none focus:border-[#c9a96e] transition text-gray-600"
          >
            {(Object.keys(filterLabels) as TimeFilter[]).map((k) => (
              <option key={k} value={k}>{filterLabels[k]}</option>
            ))}
          </select>
          <button
            onClick={() => router.push("/products/new")}
            className="flex items-center gap-2 bg-[#1a1a1a] text-white px-5 py-2 rounded-full hover:bg-[#c9a96e] transition text-sm font-medium tracking-wide"
          >
            <Plus size={14} /> Add Product
          </button>
        </div>
      </div>

      {lowStock.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl px-6 py-4 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-amber-700 font-medium text-sm">
            <AlertTriangle size={16} />
            Low Stock Alert — {lowStock.length} product{lowStock.length > 1 ? "s" : ""} running low
          </div>
          <div className="flex flex-wrap gap-2">
            {lowStock.map((p: any) => (
              <Link key={p._id} href="/products"
                className="text-xs bg-white border border-amber-200 text-amber-600 px-3 py-1 rounded-full hover:border-amber-400 transition">
                {p.name} — {
                  p.variants?.reduce(
                    (sum: number, v: any) => sum + (v.stock || 0),
                    0
                  ) ?? 0
                } left
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map(({ key, label, icon: Icon, color, href }) => (
          <Link key={key} href={href}
            className="group bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-5 hover:shadow-md hover:-translate-y-1 hover:border-[#c9a96e]/30 transition-all duration-300">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 ${color}`}>
              <Icon size={22} />
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">{label}</p>
              <p className="text-2xl font-semibold text-gray-900">
                {key === "totalRevenue"
                  ? `$${stats.totalRevenue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                  : stats[key as keyof typeof stats]}
              </p>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="mb-6 flex justify-between items-end">
            <div>
              <p className="text-[#c9a96e] text-xs tracking-[0.3em] uppercase mb-1">Analytics</p>
              <h2 className="font-serif text-2xl text-gray-900">Revenue — {filterLabels[filter]}</h2>
            </div>
            <p className="text-sm text-gray-400">
              Total: <span className="text-gray-700 font-medium">${revenue.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
            </p>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={revenueData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#c9a96e" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#c9a96e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0ece8" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} width={48} />
              <Tooltip
                contentStyle={{ background: "#fff", border: "1px solid #f0ece8", borderRadius: "12px", fontSize: "13px", boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}
                formatter={(value: any) => [`$${Number(value).toLocaleString()}`, "Revenue"]}
                cursor={{ stroke: "#c9a96e", strokeWidth: 1, strokeDasharray: "4 4" }}
              />
              <Area type="monotone" dataKey="revenue" stroke="#c9a96e" strokeWidth={2.5} fill="url(#revenueGradient)"
                dot={{ fill: "#c9a96e", r: 3, strokeWidth: 0 }}
                activeDot={{ r: 5, fill: "#c9a96e", strokeWidth: 0 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col">
          <div className="mb-5">
            <p className="text-[#c9a96e] text-xs tracking-[0.3em] uppercase mb-1">Live</p>
            <h2 className="font-serif text-2xl text-gray-900">Recent Activity</h2>
          </div>

          {activityLog.length === 0 ? (
            <p className="text-sm text-gray-400 text-center mt-8">No activity yet</p>
          ) : (
            <div className="flex flex-col gap-1 overflow-y-auto max-h-[300px] pr-1">
              {activityLog.map((item) => {
                const isStock = item.type === "stock"
                const isUser = item.type === "user"
                return (
                  <div
                    key={item.id + item.type}
                    className={`flex gap-3 p-3 rounded-xl transition ${isStock ? "bg-amber-50" : "hover:bg-[#faf7f4]"}`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${isStock ? "bg-amber-100 text-amber-500"
                      : isUser ? "bg-[#fde8ed] text-[#c97a8f]"
                        : "bg-[#faf0e6] text-[#c9a96e]"
                      }`}>
                      {isStock ? <AlertTriangle size={14} />
                        : isUser ? <UserPlus size={14} />
                          : <ShoppingCart size={14} />}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className={`text-xs leading-relaxed ${isStock ? "text-amber-700 font-medium" : "text-gray-600"}`}>
                        {item.text}
                      </p>
                      <p className="text-[10px] text-gray-300 mt-1">{timeAgo(item.date)}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-8 py-6 border-b border-gray-50 flex justify-between items-end">
          <div>
            <p className="text-[#c9a96e] text-xs tracking-[0.3em] uppercase mb-1">Latest</p>
            <h2 className="font-serif text-2xl text-gray-900">Recent Orders</h2>
          </div>
          <Link href="/orders" className="text-xs text-gray-400 hover:text-[#c9a96e] transition tracking-wide uppercase">
            View all →
          </Link>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-50">
              <th className="text-left px-8 py-4 text-xs text-gray-400 uppercase tracking-wider font-medium">Order ID</th>
              <th className="text-left px-6 py-4 text-xs text-gray-400 uppercase tracking-wider font-medium">Customer</th>
              <th className="text-left px-6 py-4 text-xs text-gray-400 uppercase tracking-wider font-medium">Date</th>
              <th className="text-left px-6 py-4 text-xs text-gray-400 uppercase tracking-wider font-medium">Total</th>
              <th className="text-left px-6 py-4 text-xs text-gray-400 uppercase tracking-wider font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {recentOrders.length === 0 ? (
              <tr><td colSpan={5} className="px-8 py-10 text-center text-sm text-gray-400">No orders yet</td></tr>
            ) : recentOrders.map((order, i) => (
              <tr key={order._id} className={`border-b border-gray-50 hover:bg-[#faf7f4] transition ${i === recentOrders.length - 1 ? "border-0" : ""}`}>
                <td className="px-8 py-4 text-sm font-mono text-gray-400">#{order._id.slice(-8)}</td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {order.user?.name || order.shippingAddress?.fullName || "—"}
                </td>
                <td className="px-6 py-4 text-sm text-gray-400">
                  {order.createdAt ? new Date(order.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—"}
                </td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  ${(order.totalPrice || 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </td>
                <td className="px-6 py-4">
                  <span className={`text-xs px-3 py-1 rounded-full font-medium capitalize ${statusColors[order.orderStatus] || "bg-gray-100 text-gray-600"}`}>
                    {order.orderStatus || "—"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </main>
  )
}
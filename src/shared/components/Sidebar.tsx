"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useAppDispatch } from "@/store/hooks"
import { clearAdmin } from "@/features/auth/authSlice"
import { authService } from "@/features/auth/authService"
import { toast } from "react-toastify"
import { LayoutDashboard, Package, ShoppingBag, Users, LogOut } from "lucide-react"

const links = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/products", label: "Products", icon: Package },
  { href: "/orders", label: "Orders", icon: ShoppingBag },
  { href: "/users", label: "Users", icon: Users },
]

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const dispatch = useAppDispatch()

  const handleLogout = async () => {
    try {
      await authService.logout()
      localStorage.removeItem("crm_token")
      dispatch(clearAdmin())
      toast.success("Logged out")
      router.push("/login")
    } catch {
      toast.error("Logout failed")
    }
  }

  return (
    <aside className="w-64 min-h-screen border-r flex flex-col">
      <div className="p-6 border-b">
        <h1 className="text-xl font-bold">Admin CRM</h1>
      </div>
      <nav className="flex-1 p-4 flex flex-col gap-1">
        {links.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-3 px-4 py-2 rounded-lg transition ${
              pathname === href ? "bg-black text-white" : "hover:bg-gray-100"
            }`}
          >
            <Icon size={18} />
            {label}
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-100 w-full text-red-500"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  )
}
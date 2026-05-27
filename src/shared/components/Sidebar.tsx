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
    <aside className="w-64 min-h-screen bg-[#1a1a1a] flex flex-col">
      <div className="p-8 border-b border-white/10">
        <p className="text-[#c9a96e] text-xs tracking-[0.3em] uppercase mb-1">Admin</p>
        <h1 className="font-serif text-2xl text-white tracking-wide">VELO</h1>
      </div>
      <nav className="flex-1 p-4 flex flex-col gap-1 mt-2">
        {links.map(({ href, label, icon: Icon }) => {
          const active = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition text-sm ${
                active
                  ? "bg-[#c9a96e] text-white font-medium"
                  : "text-gray-400 hover:text-white hover:bg-white/10"
              }`}
            >
              <Icon size={17} />
              {label}
            </Link>
          )
        })}
      </nav>
      <div className="p-6 border-t border-white/10 mb-2">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 w-full text-gray-400 hover:text-red-400 transition text-sm"
        >
          <LogOut size={17} />
          Logout
        </button>
      </div>
    </aside>
  )
}
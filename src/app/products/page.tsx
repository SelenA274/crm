"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAppSelector } from "@/store/hooks"
import api from "@/lib/axios"
import { toast } from "react-toastify"
import { Trash2, Plus } from "lucide-react"

export default function ProductsPage() {
  const { isAuthenticated } = useAppSelector((state) => state.auth)
  const router = useRouter()
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const token = typeof window !== "undefined" ? localStorage.getItem("crm_token") : null
  const config = { headers: { Authorization: `Bearer ${token}` } }

  useEffect(() => {
    if (!isAuthenticated) { router.push("/login"); return }
    api.get("/product", config)
      .then((res) => setProducts(res.data.data || res.data || []))
      .catch(() => toast.error("Failed to load products"))
      .finally(() => setLoading(false))
  }, [isAuthenticated])

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/product/${id}`, config)
      setProducts(products.filter((p) => p._id !== id))
      toast.success("Product deleted")
    } catch {
      toast.error("Failed to delete product")
    }
  }

  if (loading) return <p className="text-center mt-10">Loading...</p>

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Products</h1>
        <button
          onClick={() => router.push("/products/new")}
          className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800"
        >
          <Plus size={16} /> Add Product
        </button>
      </div>
      <div className="border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-4 text-sm font-semibold">Name</th>
              <th className="text-left p-4 text-sm font-semibold">Category</th>
              <th className="text-left p-4 text-sm font-semibold">Price</th>
              <th className="text-left p-4 text-sm font-semibold">Stock</th>
              <th className="text-left p-4 text-sm font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id} className="border-t">
                <td className="p-4">{product.name}</td>
                <td className="p-4">{product.category}</td>
                <td className="p-4">${product.price}</td>
                <td className="p-4">{product.stock}</td>
                <td className="p-4">
                  <button
                    onClick={() => handleDelete(product._id)}
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
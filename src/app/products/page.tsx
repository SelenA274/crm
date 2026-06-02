"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { useAppSelector } from "@/store/hooks"
import api from "@/lib/axios"
import { toast } from "react-toastify"
import { Trash2, Plus, Pencil, X } from "lucide-react"
import VariantsEditor from "@/features/products/components/VariantsEditor"
import {
  DEPARTMENTS,
  SUBCATEGORIES,
  createEmptyVariant,
  formatSubcategory,
  getVariantKind,
  stripVariantIds,
  type Department,
  type Product,
  type ProductVariant,
} from "@/types/product"

const inputClass =
  "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:border-[#c9a96e] transition placeholder:text-gray-300"

interface EditForm {
  name: string
  brand: string
  description: string
  price: string
  department: Department | ""
  subcategory: string
  mainImage: string
}

const emptyEditForm: EditForm = {
  name: "",
  brand: "",
  description: "",
  price: "",
  department: "",
  subcategory: "",
  mainImage: "",
}

export default function ProductsPage() {
  const { isAuthenticated } = useAppSelector((state) => state.auth)
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [editProduct, setEditProduct] = useState<Product | null>(null)
  const [editForm, setEditForm] = useState<EditForm>(emptyEditForm)
  const [editVariants, setEditVariants] = useState<ProductVariant[]>([])
  const [saving, setSaving] = useState(false)

  const token = typeof window !== "undefined" ? localStorage.getItem("crm_token") : null
  const config = { headers: { Authorization: `Bearer ${token}` } }

  const editVariantKind = useMemo(
    () => (editForm.subcategory ? getVariantKind(editForm.subcategory) : "size"),
    [editForm.subcategory]
  )

  const editSubcategoryOptions = editForm.department ? SUBCATEGORIES[editForm.department] : []
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
      return
    }
    api
      .get(`/product?page=${currentPage}`, config)
      .then((res) => {
        setProducts(res.data.data || [])
        setTotalPages(res.data.totalPages || 1)
      })
      .catch((err) => {
        console.log("ERROR:", err)
        toast.error("Failed to load products")
      })
      .finally(() => setLoading(false))
  }, [isAuthenticated, currentPage])

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/product/${id}`, config)
      setProducts(products.filter((p) => p._id !== id))
      toast.success("Product deleted")
    } catch {
      toast.error("Failed to delete product")
    }
  }

  const openEdit = (product: Product) => {
    setEditProduct(product)
    setEditForm({
      name: product.name,
      brand: product.brand,
      description: product.description || "",
      price: String(product.price),
      department: product.department,
      subcategory: product.subcategory,
      mainImage: product.mainImage || "",
    })
    setEditVariants(product.variants?.length ? [...product.variants] : [])
  }

  const closeEdit = () => {
    setEditProduct(null)
    setEditForm(emptyEditForm)
    setEditVariants([])
  }

  const handleEditChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target

    if (name === "department") {
      const department = value as Department
      const firstSub = SUBCATEGORIES[department][0]?.value ?? ""
      setEditForm({ ...editForm, department, subcategory: firstSub })
      setEditVariants([createEmptyVariant(getVariantKind(firstSub))])
      return
    }

    if (name === "subcategory") {
      const nextKind = getVariantKind(value)
      const prevKind = editForm.subcategory ? getVariantKind(editForm.subcategory) : nextKind
      setEditForm({ ...editForm, subcategory: value })
      if (nextKind !== prevKind) setEditVariants([createEmptyVariant(nextKind)])
      return
    }

    setEditForm({ ...editForm, [name]: value })
  }

  const handleEditSave = async () => {
    if (!editProduct) return
    setSaving(true)
    try {
      const res = await api.put(
        `/product/${editProduct._id}`,
        {
          name: editForm.name,
          brand: editForm.brand,
          description: editForm.description,
          price: Number(editForm.price),
          department: editForm.department,
          subcategory: editForm.subcategory,
          mainImage: editForm.mainImage,
          variantKind: editVariantKind,
          variants: stripVariantIds(editVariants),
        },
        config
      )
      const updated = res.data.data || res.data
      setProducts(products.map((p) => (p._id === editProduct._id ? { ...p, ...updated } : p)))
      toast.success("Product updated")
      closeEdit()
    } catch {
      toast.error("Failed to update product")
    } finally {
      setSaving(false)
    }
  }

  if (loading)
    return (
      <main className="px-8 py-10">
        <p className="text-gray-400">Loading...</p>
      </main>
    )

  return (
    <>
      <main className="px-8 py-10">
        <div className="flex justify-between items-end mb-10">
          <div>
            <p className="text-[#c9a96e] text-xs tracking-[0.3em] uppercase mb-2">Catalog</p>
            <h1 className="font-serif text-4xl text-gray-900">Products</h1>
          </div>
          <button
            onClick={() => router.push("/products/new")}
            className="flex items-center gap-2 bg-[#1a1a1a] text-white px-5 py-2.5 rounded-full hover:bg-[#c9a96e] transition text-sm font-medium tracking-wide"
          >
            <Plus size={15} /> Add Product
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-6 py-4 text-xs text-gray-400 uppercase tracking-wider font-medium">
                  Product
                </th>
                <th className="text-left px-6 py-4 text-xs text-gray-400 uppercase tracking-wider font-medium">
                  Brand
                </th>
                <th className="text-left px-6 py-4 text-xs text-gray-400 uppercase tracking-wider font-medium">
                  Department
                </th>
                <th className="text-left px-6 py-4 text-xs text-gray-400 uppercase tracking-wider font-medium">
                  Subcategory
                </th>
                <th className="text-left px-6 py-4 text-xs text-gray-400 uppercase tracking-wider font-medium">
                  Price
                </th>
                <th className="text-left px-6 py-4 text-xs text-gray-400 uppercase tracking-wider font-medium">
                  Stock
                </th>
                <th className="text-left px-6 py-4 text-xs text-gray-400 uppercase tracking-wider font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, i) => (
                <tr
                  key={product._id}
                  className={`border-b border-gray-50 hover:bg-[#faf7f4] transition ${i === products.length - 1 ? "border-0" : ""}`}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {product.mainImage && (
                        <img
                          src={product.mainImage}
                          alt=""
                          className="w-10 h-10 rounded-lg object-cover border border-gray-100"
                        />
                      )}
                      <span className="font-medium text-gray-900 text-sm">{product.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">{product.brand}</td>
                  <td className="px-6 py-4">
                    <span className="bg-[#fde8ed] text-[#c97a8f] text-xs px-3 py-1 rounded-full font-medium capitalize">
                      {product.department?.replace("-", " ")}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {formatSubcategory(product.subcategory)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">${product.price}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {product.variants?.reduce(
                      (sum, variant) => sum + (variant.stock || 0),
                      0
                    ) ?? 0}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => openEdit(product)}
                        className="text-gray-300 hover:text-[#c9a96e] transition"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="text-gray-300 hover:text-red-400 transition"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-center items-center gap-3 mt-8">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="px-4 py-2 border rounded-full disabled:opacity-40"
          >
            Prev
          </button>

          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => setCurrentPage(i + 1)}
              className={`w-10 h-10 rounded-full border ${currentPage === i + 1
                  ? "bg-[#0d1b3d] text-white"
                  : "bg-white text-gray-700"
                }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="px-4 py-2 border rounded-full disabled:opacity-40"
          >
            Next
          </button>
        </div>

      </main>

      {editProduct && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={closeEdit}
        >
          <div
            className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-6">
              <div>
                <p className="text-[#c9a96e] text-xs tracking-[0.3em] uppercase mb-1">Catalog</p>
                <h2 className="font-serif text-2xl text-gray-900">Edit Product</h2>
              </div>
              <button onClick={closeEdit} className="text-gray-300 hover:text-gray-600 transition mt-1">
                <X size={20} />
              </button>
            </div>

            <div className="flex flex-col gap-3">
              <input
                name="name"
                placeholder="Product name"
                value={editForm.name}
                onChange={handleEditChange}
                className={inputClass}
              />
              <input
                name="brand"
                placeholder="Brand"
                value={editForm.brand}
                onChange={handleEditChange}
                className={inputClass}
              />
              <textarea
                name="description"
                placeholder="Description"
                value={editForm.description}
                onChange={handleEditChange}
                className={`${inputClass} resize-none h-20`}
              />
              <input
                name="price"
                type="number"
                min={0}
                step="0.01"
                placeholder="Price"
                value={editForm.price}
                onChange={handleEditChange}
                className={inputClass}
              />
              <div className="grid grid-cols-2 gap-3">
                <select
                  name="department"
                  value={editForm.department}
                  onChange={handleEditChange}
                  className={inputClass}
                >
                  {DEPARTMENTS.map((d) => (
                    <option key={d.value} value={d.value}>
                      {d.label}
                    </option>
                  ))}
                </select>
                <select
                  name="subcategory"
                  value={editForm.subcategory}
                  onChange={handleEditChange}
                  className={inputClass}
                >
                  {editSubcategoryOptions.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>
              <input
                name="mainImage"
                type="url"
                placeholder="Main image URL"
                value={editForm.mainImage}
                onChange={handleEditChange}
                className={inputClass}
              />
              <VariantsEditor
                variantKind={editVariantKind}
                variants={editVariants}
                onChange={setEditVariants}
              />
              <p className="text-xs text-gray-400">
                Total stock:{" "}
                {editVariants.reduce((sum, v) => sum + (v.stock || 0), 0)} (computed on save)
              </p>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={closeEdit}
                className="flex-1 border border-gray-200 text-gray-500 py-3 rounded-full hover:bg-gray-50 transition text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleEditSave}
                disabled={saving}
                className="flex-1 bg-[#1a1a1a] text-white py-3 rounded-full hover:bg-[#c9a96e] transition text-sm font-medium disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

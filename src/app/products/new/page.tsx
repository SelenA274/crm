"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { useAppSelector } from "@/store/hooks"
import api from "@/lib/axios"
import { toast } from "react-toastify"
import { ArrowLeft } from "lucide-react"
import VariantsEditor from "@/features/products/components/VariantsEditor"
import {
  DEPARTMENTS,
  SUBCATEGORIES,
  createEmptyVariant,
  getVariantKind,
  type Department,
  type ProductVariant,
} from "@/types/product"

const inputClass =
  "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:border-[#c9a96e] transition placeholder:text-gray-300"

export default function NewProductPage() {
  const { isAuthenticated } = useAppSelector((state) => state.auth)
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [images, setImages] = useState<File[]>([])
  const [form, setForm] = useState({
    name: "",
    brand: "",
    description: "",
    price: "",
    department: "" as Department | "",
    subcategory: "",
    mainImage: "",
  })
  const [variants, setVariants] = useState<ProductVariant[]>([createEmptyVariant("size")])

  const variantKind = useMemo(
    () => (form.subcategory ? getVariantKind(form.subcategory) : "size"),
    [form.subcategory]
  )

  const subcategoryOptions = form.department ? SUBCATEGORIES[form.department] : []

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target

    if (name === "department") {
      const department = value as Department
      const firstSub = SUBCATEGORIES[department][0]?.value ?? ""
      setForm({ ...form, department, subcategory: firstSub })
      setVariants([createEmptyVariant(getVariantKind(firstSub))])
      return
    }

    if (name === "subcategory") {
      setForm({ ...form, subcategory: value })
      setVariants([createEmptyVariant(getVariantKind(value))])
      return
    }

    setForm({ ...form, [name]: value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const mainImage = form.mainImage.trim()

    if (!mainImage && images.length === 0) {
      toast.error("Main image is required")
      return
    }

    setLoading(true)
    try {
      const cleanVariants = variants.map(({ _id, ...v }) => v)

      if (images.length > 0) {
        const formData = new FormData()
        formData.append("name", form.name)
        formData.append("brand", form.brand)
        formData.append("description", form.description)
        formData.append("price", String(Number(form.price)))
        formData.append("department", form.department)
        formData.append("subcategory", form.subcategory)
        formData.append("variantKind", variantKind)
        formData.append("variants", JSON.stringify(cleanVariants))
        formData.append("isActive", "true")
        if (mainImage) formData.append("mainImage", mainImage)

        formData.append("image", images[0], images[0].name)
        images.slice(1).forEach((img) => {
          formData.append("images", img, img.name)
        })

        await api.post("/product", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
      } else {
        await api.post("/product", {
          name: form.name,
          brand: form.brand,
          description: form.description,
          price: Number(form.price),
          department: form.department,
          subcategory: form.subcategory,
          mainImage,
          variantKind,
          variants: cleanVariants,
          isActive: true,
        })
      }

      toast.success("Product created!")
      router.push("/products")
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to create product")
    } finally {
      setLoading(false)
    }
  }

  if (!isAuthenticated) return null

  return (
    <main className="px-8 py-10 max-w-2xl">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-gray-400 hover:text-gray-700 transition text-sm mb-8"
      >
        <ArrowLeft size={16} /> Back
      </button>
      <div className="mb-8">
        <p className="text-[#c9a96e] text-xs tracking-[0.3em] uppercase mb-2">Catalog</p>
        <h1 className="font-serif text-4xl text-gray-900">Add Product</h1>
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            name="name"
            placeholder="Product name"
            value={form.name}
            onChange={handleChange}
            className={inputClass}
            required
          />
          <input
            name="brand"
            placeholder="Brand (e.g. Fenty Beauty)"
            value={form.brand}
            onChange={handleChange}
            className={inputClass}
            required
          />
          <textarea
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            className={`${inputClass} resize-none h-24`}
            required
          />
          <input
            name="price"
            type="number"
            min={0}
            step="0.01"
            placeholder="Base price"
            value={form.price}
            onChange={handleChange}
            className={inputClass}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <select
              name="department"
              value={form.department}
              onChange={handleChange}
              className={inputClass}
              required
            >
              <option value="" disabled>
                Select department
              </option>
              {DEPARTMENTS.map((d) => (
                <option key={d.value} value={d.value}>
                  {d.label}
                </option>
              ))}
            </select>
            <select
              name="subcategory"
              value={form.subcategory}
              onChange={handleChange}
              className={inputClass}
              required
              disabled={!form.department}
            >
              <option value="" disabled>
                Select subcategory
              </option>
              {subcategoryOptions.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          <input
            name="mainImage"
            type="url"
            placeholder="Main image URL (optional if uploading file)"
            value={form.mainImage}
            onChange={handleChange}
            className={inputClass}
          />

          <div className="border border-dashed border-gray-200 rounded-xl px-4 py-3">
            <label className="text-xs text-gray-400 mb-2 block">
              Upload images (first = main image)
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => setImages(Array.from(e.target.files || []))}
              className="text-sm text-gray-500 w-full"
            />
            {images.length > 0 && (
              <p className="text-xs text-gray-400 mt-1">
                {images.length} file{images.length > 1 ? "s" : ""} selected
              </p>
            )}
          </div>

          {form.subcategory && (
            <VariantsEditor
              variantKind={variantKind}
              variants={variants}
              onChange={setVariants}
            />
          )}

          <button
            type="submit"
            disabled={loading || !form.department || !form.subcategory}
            className="mt-2 bg-[#1a1a1a] text-white py-3.5 rounded-full hover:bg-[#c9a96e] transition text-sm font-medium tracking-wider disabled:opacity-50"
          >
            {loading ? "Creating..." : "CREATE PRODUCT"}
          </button>
        </form>
      </div>
    </main>
  )
}
"use client"

import { Plus, Trash2 } from "lucide-react"
import type { ColorVariant, ProductVariant, SizeVariant, VariantKind } from "@/types/product"
import { createEmptyVariant } from "@/types/product"

const inputClass =
  "w-full border border-gray-200 rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:border-[#c9a96e] transition placeholder:text-gray-300"

interface VariantsEditorProps {
  variantKind: VariantKind
  variants: ProductVariant[]
  onChange: (variants: ProductVariant[]) => void
}

export default function VariantsEditor({ variantKind, variants, onChange }: VariantsEditorProps) {
  const updateVariant = (index: number, patch: Partial<ProductVariant>) => {
    onChange(variants.map((v, i) => (i === index ? { ...v, ...patch } : v)))
  }

  const addVariant = () => {
    onChange([...variants, createEmptyVariant(variantKind)])
  }

  const removeVariant = (index: number) => {
    if (variants.length <= 1) return
    onChange(variants.filter((_, i) => i !== index))
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <label className="text-xs text-gray-400 uppercase tracking-wider font-medium">
          Variants ({variantKind === "color" ? "Color" : "Size"})
        </label>
        <button
          type="button"
          onClick={addVariant}
          className="flex items-center gap-1 text-xs text-[#c9a96e] hover:text-[#1a1a1a] transition"
        >
          <Plus size={14} /> Add variant
        </button>
      </div>

      {variants.map((variant, index) => (
        <div key={index} className="border border-gray-100 rounded-xl p-3 bg-[#faf7f4]/50 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400">Variant {index + 1}</span>
            {variants.length > 1 && (
              <button
                type="button"
                onClick={() => removeVariant(index)}
                className="text-gray-300 hover:text-red-400 transition"
              >
                <Trash2 size={14} />
              </button>
            )}
          </div>

          {variantKind === "color" ? (
            <div className="grid grid-cols-2 gap-2">
              <input
                placeholder="Color name"
                value={(variant as ColorVariant).colorName}
                onChange={(e) => updateVariant(index, { colorName: e.target.value })}
                className={inputClass}
                required
              />
              <div className="flex gap-2">
                <input
                  type="color"
                  value={(variant as ColorVariant).colorCode}
                  onChange={(e) => updateVariant(index, { colorCode: e.target.value })}
                  className="w-10 h-9 rounded-lg border border-gray-200 cursor-pointer p-0.5"
                />
                <input
                  placeholder="#HEX"
                  value={(variant as ColorVariant).colorCode}
                  onChange={(e) => updateVariant(index, { colorCode: e.target.value })}
                  className={inputClass}
                  required
                />
              </div>
              <input
                type="number"
                min={0}
                placeholder="Stock"
                value={(variant as ColorVariant).stock || ""}
                onChange={(e) => updateVariant(index, { stock: Number(e.target.value) })}
                className={inputClass}
                required
              />
              <input
                placeholder="SKU (optional)"
                value={(variant as ColorVariant).sku || ""}
                onChange={(e) => updateVariant(index, { sku: e.target.value || undefined })}
                className={inputClass}
              />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              <input
                placeholder="Size label (e.g. 50ml)"
                value={(variant as SizeVariant).sizeLabel}
                onChange={(e) => updateVariant(index, { sizeLabel: e.target.value })}
                className={inputClass}
                required
              />
              <input
                type="number"
                min={0}
                placeholder="Stock"
                value={(variant as SizeVariant).stock || ""}
                onChange={(e) => updateVariant(index, { stock: Number(e.target.value) })}
                className={inputClass}
                required
              />
              <input
                placeholder="SKU (optional)"
                value={(variant as SizeVariant).sku || ""}
                onChange={(e) => updateVariant(index, { sku: e.target.value || undefined })}
                className={inputClass}
              />
              <input
                type="number"
                min={0}
                step="0.01"
                placeholder="Price override (optional)"
                value={(variant as SizeVariant).price ?? ""}
                onChange={(e) =>
                  updateVariant(index, {
                    price: e.target.value ? Number(e.target.value) : undefined,
                  })
                }
                className={inputClass}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

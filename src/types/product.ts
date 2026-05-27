export type Department =
  | "makeup"
  | "skincare"
  | "fragrance"
  | "hair-care"
  | "body-care"

export type VariantKind = "color" | "size"

export interface ColorVariant {
  _id?: string
  colorName: string
  colorCode: string
  stock: number
  sku?: string
}

export interface SizeVariant {
  _id?: string
  sizeLabel: string
  stock: number
  sku?: string
  price?: number
}

export type ProductVariant = ColorVariant | SizeVariant

export interface Product {
  _id: string
  name: string
  brand: string
  description?: string
  price: number
  department: Department
  subcategory: string
  mainImage?: string
  images?: string[]
  variantKind: VariantKind
  variants: ProductVariant[]
  totalStock: number
  sold?: number
  isActive?: boolean
  averageRating?: number
  createdAt?: string
  updatedAt?: string
}

export const DEPARTMENTS: { value: Department; label: string }[] = [
  { value: "makeup", label: "Makeup" },
  { value: "skincare", label: "Skincare" },
  { value: "fragrance", label: "Fragrance" },
  { value: "hair-care", label: "Hair Care" },
  { value: "body-care", label: "Body Care" },
]

export const SUBCATEGORIES: Record<Department, { value: string; label: string }[]> = {
  makeup: [
    { value: "lips", label: "Lips" },
    { value: "face", label: "Face" },
    { value: "eyes", label: "Eyes" },
    { value: "brows", label: "Brows" },
    { value: "tools", label: "Tools" },
  ],
  skincare: [
    { value: "morning-routine", label: "Morning Routine" },
    { value: "evening-routine", label: "Evening Routine" },
    { value: "spf-sun-care", label: "SPF & Sun Care" },
    { value: "masks-treatments", label: "Masks & Treatments" },
  ],
  fragrance: [
    { value: "floral", label: "Floral" },
    { value: "woody", label: "Woody" },
    { value: "fresh", label: "Fresh" },
    { value: "oriental", label: "Oriental" },
  ],
  "hair-care": [
    { value: "shampoo-conditioner", label: "Shampoo & Conditioner" },
    { value: "hair-masks-treatments", label: "Hair Masks & Treatments" },
    { value: "styling", label: "Styling" },
  ],
  "body-care": [
    { value: "moisturizers", label: "Moisturizers" },
    { value: "scrubs", label: "Scrubs" },
    { value: "bath-shower", label: "Bath & Shower" },
  ],
}

const COLOR_SUBCATEGORIES = new Set(["lips", "face", "eyes", "brows"])

export function getVariantKind(subcategory: string): VariantKind {
  return COLOR_SUBCATEGORIES.has(subcategory) ? "color" : "size"
}

export function formatSubcategory(slug: string): string {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ")
}

export function createEmptyVariant(kind: VariantKind): ProductVariant {
  return kind === "color"
    ? { colorName: "", colorCode: "#000000", stock: 0 }
    : { sizeLabel: "", stock: 0 }
}

export function stripVariantIds(variants: ProductVariant[]): ProductVariant[] {
  return variants.map(({ _id, ...rest }) => rest as ProductVariant)
}

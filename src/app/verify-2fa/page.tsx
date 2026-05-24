import { Suspense } from "react"
import Verify2FAForm from "@/features/auth/components/Verify2FAForm"

export default function Verify2FAPage() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-6">
        <h1 className="text-2xl font-bold">Two-Factor Authentication</h1>
        <p className="text-sm text-gray-500">Enter the code sent to your email</p>
        <Suspense fallback={<p>Loading...</p>}>
          <Verify2FAForm />
        </Suspense>
      </div>
    </main>
  )
}
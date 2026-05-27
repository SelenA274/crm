import { Suspense } from "react"
import Verify2FAForm from "@/features/auth/components/Verify2FAForm"

export default function Verify2FAPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#faf7f4]">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <p className="text-[#c9a96e] text-xs tracking-[0.3em] uppercase mb-3">Security</p>
          <h1 className="font-serif text-4xl text-gray-900">Verify Identity</h1>
          <p className="text-sm text-gray-400 mt-3">Enter the code sent to your email</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <Suspense fallback={<p className="text-gray-400 text-sm">Loading...</p>}>
            <Verify2FAForm />
          </Suspense>
        </div>
      </div>
    </main>
  )
}
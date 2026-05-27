import AdminLoginForm from "@/features/auth/components/AdminLoginForm"

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#faf7f4]">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <p className="text-[#c9a96e] text-xs tracking-[0.3em] uppercase mb-3">Welcome Back</p>
          <h1 className="font-serif text-4xl text-gray-900">VELO Admin</h1>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <AdminLoginForm />
        </div>
      </div>
    </main>
  )
}
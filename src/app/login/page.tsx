"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { authService } from "@/features/auth/authService"
import { toast } from "react-toastify"
import { Eye, EyeOff, Lock, Mail } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [form, setForm] = useState({ email: "", password: "" })
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [focusedField, setFocusedField] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await authService.adminLogin(form)
      toast.success("2FA code sent to your email!")
      router.push(`/verify-2fa?email=${form.email}`)
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Login failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #faf7f2 0%, #efe7da 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'Cormorant Garamond', 'Georgia', serif",
      position: "relative",
      overflow: "hidden",
      padding: "24px",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600&family=Cormorant+Garamond:wght@300;400;500&display=swap');
        .auth-input:focus { outline: none; border-color: #c9a96e !important; box-shadow: 0 0 0 3px rgba(201,169,110,0.12) !important; }
        .auth-input::placeholder { color: #c8b99a; }
        .gold-btn:hover:not(:disabled) { background: linear-gradient(135deg, #d4b87a, #b8904a) !important; box-shadow: 0 8px 32px rgba(201,169,110,0.45) !important; transform: translateY(-1px); }
        .gold-btn:active:not(:disabled) { transform: translateY(0); }
        .gold-btn { transition: all 0.25s ease !important; }
        .eye-btn:hover { color: #c9a96e !important; }
      `}</style>

      <div style={{ position: "absolute", top: "-80px", right: "-80px", width: "420px", height: "420px", borderRadius: "50%", background: "radial-gradient(circle, rgba(201,169,110,0.18) 0%, transparent 70%)", filter: "blur(40px)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "-100px", left: "-100px", width: "520px", height: "520px", borderRadius: "50%", background: "radial-gradient(circle, rgba(201,169,110,0.12) 0%, transparent 70%)", filter: "blur(60px)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", top: "40%", left: "60%", width: "300px", height: "300px", borderRadius: "50%", background: "radial-gradient(circle, rgba(239,213,170,0.15) 0%, transparent 70%)", filter: "blur(50px)", pointerEvents: "none" }} />

      <div style={{
        background: "rgba(255,255,255,0.55)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        borderRadius: "32px",
        border: "1px solid rgba(201,169,110,0.18)",
        boxShadow: "0 8px 48px rgba(180,150,100,0.13), 0 2px 8px rgba(0,0,0,0.04)",
        padding: "56px 48px",
        width: "100%",
        maxWidth: "420px",
        zIndex: 1,
        position: "relative" as const,
      }}>

        <div style={{ marginBottom: "40px", textAlign: "center" as const }}>
          <p style={{
            fontSize: "0.7rem", letterSpacing: "0.35em", textTransform: "uppercase" as const,
            color: "#c9a96e", marginBottom: "10px", fontFamily: "sans-serif", fontWeight: 500,
          }}>
            Welcome Back
          </p>
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "2.6rem", fontWeight: 600,
            color: "#2a1f14", margin: "0 0 12px", lineHeight: 1.2,
          }}>
            VELO Admin
          </h1>
          <p style={{ fontSize: "0.88rem", color: "#9a8870", margin: 0, fontFamily: "sans-serif", fontWeight: 300 }}>
            Sign in to your account
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column" as const, gap: "14px" }}>


          <div style={{ position: "relative" as const }}>
            <Mail size={15} color={focusedField === "email" ? "#c9a96e" : "#c8b99a"}
              style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", transition: "color 0.2s", pointerEvents: "none" }} />
            <input
              name="email"
              type="email"
              placeholder="Admin email"
              value={form.email}
              onChange={handleChange}
              onFocus={() => setFocusedField("email")}
              onBlur={() => setFocusedField(null)}
              className="auth-input"
              required
              style={{
                width: "100%", border: "1.5px solid rgba(201,169,110,0.25)", borderRadius: "14px",
                padding: "14px 16px 14px 44px", fontSize: "0.9rem",
                background: "rgba(255,255,255,0.8)", color: "#2a1f14",
                boxSizing: "border-box" as const, fontFamily: "sans-serif",
                transition: "border-color 0.2s, box-shadow 0.2s",
              }}
            />
          </div>


          <div style={{ position: "relative" as const }}>
            <Lock size={15} color={focusedField === "password" ? "#c9a96e" : "#c8b99a"}
              style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", transition: "color 0.2s", pointerEvents: "none" }} />
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              onFocus={() => setFocusedField("password")}
              onBlur={() => setFocusedField(null)}
              className="auth-input"
              required
              style={{
                width: "100%", border: "1.5px solid rgba(201,169,110,0.25)", borderRadius: "14px",
                padding: "14px 44px 14px 44px", fontSize: "0.9rem",
                background: "rgba(255,255,255,0.8)", color: "#2a1f14",
                boxSizing: "border-box" as const, fontFamily: "sans-serif",
                transition: "border-color 0.2s, box-shadow 0.2s",
              }}
            />
            <button
              type="button"
              className="eye-btn"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
              style={{
                position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)",
                background: "none", border: "none", cursor: "pointer",
                color: "#c8b99a", padding: 0, display: "flex", alignItems: "center",
                transition: "color 0.2s",
              }}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>


          <button
            type="submit"
            disabled={loading}
            className="gold-btn"
            style={{
              marginTop: "8px",
              background: loading ? "rgba(201,169,110,0.5)" : "linear-gradient(135deg, #c9a96e, #a8803d)",
              color: "#fff", border: "none", borderRadius: "50px",
              padding: "15px", fontSize: "0.78rem", fontFamily: "sans-serif",
              fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase" as const,
              cursor: loading ? "not-allowed" : "pointer",
              boxShadow: "0 4px 20px rgba(201,169,110,0.35)",
            }}
          >
            {loading ? "Verifying..." : "Sign In"}
          </button>
        </form>

        <div style={{ textAlign: "center" as const, marginTop: "24px" }}>
          <a href="/forgot-password" style={{
            fontSize: "0.82rem", color: "#c9a96e", textDecoration: "none",
            fontFamily: "sans-serif", borderBottom: "1px solid rgba(201,169,110,0.35)",
            paddingBottom: "1px", transition: "opacity 0.2s",
          }}>
            Forgot your password?
          </a>
        </div>

      </div>
    </main>
  )
}
"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { authService } from "@/features/auth/authService"
import { toast } from "react-toastify"
import { ArrowLeft, Eye, EyeOff, Lock } from "lucide-react"

const authStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600&family=Cormorant+Garamond:wght@300;400;500&display=swap');
  .auth-input:focus { outline: none; border-color: #c9a96e !important; box-shadow: 0 0 0 3px rgba(201,169,110,0.12) !important; }
  .auth-input::placeholder { color: #c8b99a; }
  .gold-btn:hover:not(:disabled) { background: linear-gradient(135deg, #d4b87a, #b8904a) !important; box-shadow: 0 8px 32px rgba(201,169,110,0.45) !important; transform: translateY(-1px); }
  .gold-btn:active:not(:disabled) { transform: translateY(0); }
  .gold-btn { transition: all 0.25s ease !important; }
  .eye-btn:hover { color: #c9a96e !important; }
`

export default function ResetPasswordPage() {
  const router = useRouter()
  const params = useParams()
  const token = typeof params.token === "string" ? params.token : ""

  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [focusedField, setFocusedField] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token) {
      toast.error("Invalid reset link")
      return
    }
    setLoading(true)
    try {
      await authService.resetPassword(token, password)
      toast.success("Password updated successfully!")
      router.push("/login")
    } catch (err: unknown) {
      const message =
        err && typeof err === "object" && "response" in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : undefined
      toast.error(message || "Failed to reset password")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #faf7f2 0%, #efe7da 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Cormorant Garamond', 'Georgia', serif",
        position: "relative",
        overflow: "hidden",
        padding: "24px",
      }}
    >
      <style>{authStyles}</style>

      <div
        style={{
          position: "absolute",
          top: "-80px",
          right: "-80px",
          width: "420px",
          height: "420px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(201,169,110,0.18) 0%, transparent 70%)",
          filter: "blur(40px)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-100px",
          left: "-100px",
          width: "520px",
          height: "520px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(201,169,110,0.12) 0%, transparent 70%)",
          filter: "blur(60px)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "40%",
          left: "60%",
          width: "300px",
          height: "300px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(239,213,170,0.15) 0%, transparent 70%)",
          filter: "blur(50px)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
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
          position: "relative",
        }}
      >
        <div style={{ marginBottom: "40px", textAlign: "center" }}>
          <p
            style={{
              fontSize: "0.7rem",
              letterSpacing: "0.35em",
              textTransform: "uppercase",
              color: "#c9a96e",
              marginBottom: "10px",
              fontFamily: "sans-serif",
              fontWeight: 500,
            }}
          >
            New Credentials
          </p>
          <h1
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "2.6rem",
              fontWeight: 600,
              color: "#2a1f14",
              margin: "0 0 12px",
              lineHeight: 1.2,
            }}
          >
            Set Password
          </h1>
          <p
            style={{
              fontSize: "0.88rem",
              color: "#9a8870",
              margin: 0,
              fontFamily: "sans-serif",
              fontWeight: 300,
            }}
          >
            Choose a new password for your account
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "14px" }}
        >
          <div style={{ position: "relative" }}>
            <Lock
              size={15}
              color={focusedField === "password" ? "#c9a96e" : "#c8b99a"}
              style={{
                position: "absolute",
                left: "16px",
                top: "50%",
                transform: "translateY(-50%)",
                transition: "color 0.2s",
                pointerEvents: "none",
              }}
            />
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="New password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setFocusedField("password")}
              onBlur={() => setFocusedField(null)}
              className="auth-input"
              required
              minLength={8}
              style={{
                width: "100%",
                border: "1.5px solid rgba(201,169,110,0.25)",
                borderRadius: "14px",
                padding: "14px 44px 14px 44px",
                fontSize: "0.9rem",
                background: "rgba(255,255,255,0.8)",
                color: "#2a1f14",
                boxSizing: "border-box",
                fontFamily: "sans-serif",
                transition: "border-color 0.2s, box-shadow 0.2s",
              }}
            />
            <button
              type="button"
              className="eye-btn"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
              style={{
                position: "absolute",
                right: "14px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#c8b99a",
                padding: 0,
                display: "flex",
                alignItems: "center",
                transition: "color 0.2s",
              }}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading || !token}
            className="gold-btn"
            style={{
              marginTop: "8px",
              background: loading
                ? "rgba(201,169,110,0.5)"
                : "linear-gradient(135deg, #c9a96e, #a8803d)",
              color: "#fff",
              border: "none",
              borderRadius: "50px",
              padding: "15px",
              fontSize: "0.78rem",
              fontFamily: "sans-serif",
              fontWeight: 600,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              cursor: loading || !token ? "not-allowed" : "pointer",
              boxShadow: "0 4px 20px rgba(201,169,110,0.35)",
            }}
          >
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: "24px" }}>
          <Link
            href="/login"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "0.82rem",
              color: "#c9a96e",
              textDecoration: "none",
              fontFamily: "sans-serif",
              borderBottom: "1px solid rgba(201,169,110,0.35)",
              paddingBottom: "1px",
            }}
          >
            <ArrowLeft size={14} />
            Back to sign in
          </Link>
        </div>
      </div>
    </main>
  )
}

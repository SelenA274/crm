import api from "@/lib/axios"

export const authService = {
  adminLogin: (data: { email: string; password: string }) =>
    api.post("/auth/admin/login", data),

  verify2fa: (data: { email: string; code: string }) =>
    api.post("/auth/admin/verify-2fa", data),

  me: () => api.get("/auth/me"),

  logout: () => api.post("/auth/logout"),

  forgotPassword: (email: string) =>
    api.post("/auth/forgot-password", { email }),

  resetPassword: (token: string, password: string) =>
    api.post(`/auth/reset-password/${token}`, { password }),
}
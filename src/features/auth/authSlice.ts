import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface Admin {
  _id: string
  name: string
  email: string
  role: string
}

interface AuthState {
  admin: Admin | null
  isAuthenticated: boolean
}

const initialState: AuthState = {
  admin: null,
  isAuthenticated: false,
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAdmin(state, action: PayloadAction<Admin>) {
      state.admin = action.payload
      state.isAuthenticated = true
    },
    clearAdmin(state) {
      state.admin = null
      state.isAuthenticated = false
    },
  },
})

export const { setAdmin, clearAdmin } = authSlice.actions
export default authSlice.reducer
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, ShieldCheck } from "lucide-react"
import { useAuthStore } from "@/stores/authStore"
import { api } from "@/lib/api"

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
})

type LoginFormValues = z.infer<typeof loginSchema>

export function Login() {
  const navigate = useNavigate()
  const { login } = useAuthStore()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "cco@roiq.ai",
      password: "password123",
    }
  })

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await api.post('/auth/login', {
        username: data.email,
        password: data.password,
      })
      if (response.data?.success) {
        const authData = response.data.data
        const user = authData.user || {
          id: "usr_123", name: data.email === "cco@roiq.ai" ? "Thomas Shelby" : data.email.split("@")[0],
          email: data.email, role: authData.role || "Corporate Credit Officer",
        }
        login(user, authData.access_token)
        navigate("/")
        return
      }
      setError(response.data?.error?.message || "Invalid credentials.")
    } catch (err: any) {
      if (data.email === "cco@roiq.ai" && (data.password === "password123" || data.password === "password")) {
        login({ id: "usr_123", name: "Thomas Shelby", email: "cco@roiq.ai", role: "Corporate Credit Officer" }, "mock_jwt_token_12345")
        navigate("/")
        return
      }
      setError(err.response?.data?.error?.message || err.message || "Failed to authenticate.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex" style={{ background: "#F5F7FA" }}>

      {/* ── Left panel — Brand ── */}
      <div
        className="hidden lg:flex flex-col justify-between w-80 shrink-0 p-8"
        style={{ background: "#123B78" }}
      >
        {/* Top brand */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded bg-[#1E4FA3] border border-[#2F6FD6]/50 flex items-center justify-center">
              <span className="text-white font-extrabold text-lg">R</span>
            </div>
            <div>
              <div className="text-white font-bold text-lg tracking-wide">ROIQ</div>
              <div className="text-[#8BAED4] text-xs font-medium">Corporate Banking</div>
            </div>
          </div>
          <div className="border-t border-[#1a4d8f]" />
          <div className="space-y-4">
            <h2 className="text-white font-bold text-xl leading-snug">
              Enterprise Credit Intelligence Platform
            </h2>
            <p className="text-[#8BAED4] text-sm leading-relaxed">
              Institutional credit risk analysis, regulatory-grade loan decisioning, and portfolio risk management — built for credit officers, relationship managers, and loan committees.
            </p>
          </div>
          <div className="space-y-3">
            {[
              "Corporate Credit Risk Assessment",
              "Macroeconomic Scenario Forecasting",
              "Automated Loan Recommendation Engine",
              "Executive Credit Committee Reports",
            ].map(item => (
              <div key={item} className="flex items-center gap-2">
                <ShieldCheck className="h-3.5 w-3.5 text-[#5CA0F5] shrink-0" />
                <span className="text-[13px] text-[#A8C4E5]">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom notice */}
        <div className="text-[11px] text-[#5F7A9F] leading-relaxed">
          Authorized personnel only. All access is subject to continuous monitoring and regulatory compliance audit.
        </div>
      </div>

      {/* ── Right panel — Login form ── */}
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <div className="w-full max-w-sm">

          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="h-8 w-8 rounded bg-[#1E4FA3] flex items-center justify-center">
              <span className="text-white font-extrabold text-sm">R</span>
            </div>
            <span className="text-xl font-bold text-[#172033]">ROIQ</span>
          </div>

          <div
            className="p-8"
            style={{ background: "#FFFFFF", border: "1px solid #D9E1EA", borderRadius: "6px" }}
          >
            <h1 className="text-xl font-bold text-[#172033] mb-1">Sign In</h1>
            <p className="text-sm text-[#5F6F85] mb-6">
              Enter your credentials to access the credit workstation.
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[13px] font-semibold text-[#172033] block" htmlFor="email">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="name@roiq.ai"
                  {...register("email")}
                  className="bank-input"
                  disabled={isLoading}
                />
                {errors.email && (
                  <p className="text-xs text-[#C74646]">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-[13px] font-semibold text-[#172033] block" htmlFor="password">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  {...register("password")}
                  className="bank-input"
                  disabled={isLoading}
                />
                {errors.password && (
                  <p className="text-xs text-[#C74646]">{errors.password.message}</p>
                )}
              </div>

              {error && (
                <div
                  className="p-3 text-sm text-[#C74646] rounded"
                  style={{ background: "#FBE8E8", border: "1px solid #F0BABA" }}
                >
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary w-full justify-center py-2.5 text-sm mt-2"
              >
                {isLoading ? (
                  <><Loader2 className="h-4 w-4 animate-spin" /> Authenticating...</>
                ) : "Sign In to ROIQ"}
              </button>
            </form>

            <div className="mt-4 pt-4 border-t border-[#D9E1EA]">
              <p className="text-[11px] text-[#5F6F85] text-center">
                Default credentials: cco@roiq.ai / password123
              </p>
            </div>
          </div>

          <p className="text-[11px] text-[#5F6F85] text-center mt-4">
            ROIQ v2.4 · Corporate Banking Platform · ROIQ Financial Technologies
          </p>
        </div>
      </div>
    </div>
  )
}

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { ShieldAlert, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuthStore } from "@/stores/authStore"

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
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500))

    if (data.email === "cco@roiq.ai") {
      login({
        id: "usr_123",
        name: "Thomas Shelby",
        email: "cco@roiq.ai",
        role: "Corporate Credit Officer"
      }, "mock_jwt_token_12345")
      navigate("/")
    } else {
      setError("Invalid credentials. Please use cco@roiq.ai for the demo.")
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background/50 p-4">
      <Card className="w-full max-w-md shadow-2xl border-border/50">
        <CardHeader className="space-y-3 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-primary/10 p-3 rounded-xl border border-primary/20">
              <svg className="h-10 w-10 text-primary transform -rotate-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="10" cy="10" r="6" />
                <line x1="21" y1="21" x2="14.5" y2="14.5" />
                <text x="7.5" y="13.5" fontSize="10" fontWeight="bold" fill="currentColor" stroke="none" fontFamily="sans-serif">$</text>
              </svg>
            </div>
          </div>
          <CardTitle className="text-3xl font-bold tracking-tight">ROIQ</CardTitle>
          <CardDescription className="text-muted-foreground">
            Enterprise Corporate Credit Intelligence
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none" htmlFor="email">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="name@roiq.ai"
                {...register("email")}
                className="bg-background"
                disabled={isLoading}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium leading-none" htmlFor="password">
                  Password
                </label>
              </div>
              <Input
                id="password"
                type="password"
                {...register("password")}
                className="bg-background"
                disabled={isLoading}
              />
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password.message}</p>
              )}
            </div>
            
            {error && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-md">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full h-11 text-base font-medium" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Authenticating...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center border-t border-border/50 pt-6">
          <p className="text-xs text-muted-foreground text-center">
            Authorized personnel only. Access is continuously monitored.
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/useAuthStore";
import { LogIn, Loader2 } from "lucide-react";
import {
  AuthCard,
  FormField,
  PasswordInput,
} from "@/components/auth/AuthComponents";
import { useAuthForm, loginSchema } from "@/hooks/auth/useAuthForm";

export default function LoginPage() {
  const { login, isLoggingIn } = useAuthStore();

  const {
    register,
    onSubmit,
    formState: { errors },
  } = useAuthForm(loginSchema, async (data) => {
    await login(data);
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <AuthCard title="Welcome Back">
          <form onSubmit={onSubmit} className="space-y-4">
            <FormField
              label="Email"
              id="email"
              type="email"
              error={errors.email?.message}
              {...register("email")}
              placeholder="Enter your email"
            />

            <PasswordInput
              label="Password"
              id="password"
              error={errors.password?.message}
              {...register("password")}
              placeholder="Enter your password"
            />

            <div className="text-right">
              <a
                href="/forgot-password"
                className="text-sm text-primary hover:underline"
              >
                Forgot password?
              </a>
            </div>

            <Button type="submit" className="w-full" disabled={isLoggingIn}>
              {isLoggingIn ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing In...
                </>
              ) : (
                <>
                  <LogIn className="mr-2 h-4 w-4" />
                  Sign In
                </>
              )}
            </Button>
          </form>

          <div className="text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <a href="/signup" className="text-primary hover:underline">
              Sign up
            </a>
          </div>
        </AuthCard>
      </motion.div>
    </div>
  );
}

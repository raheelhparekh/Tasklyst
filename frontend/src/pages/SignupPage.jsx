import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/useAuthStore";
import { UserPlus, Loader2 } from "lucide-react";
import { AuthCard, FormField, PasswordInput } from "@/components/auth/AuthComponents";
import { useAuthForm, signupSchema } from "@/hooks/auth/useAuthForm";

export default function SignupPage() {
  const { signup, isSigningUp } = useAuthStore();

  const { register, onSubmit, formState: { errors } } = useAuthForm(
    signupSchema,
    async (data) => {
      await signup(data);
    }
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <AuthCard title="Create Account">
          <form onSubmit={onSubmit} className="space-y-4">
            <FormField
              label="Username"
              id="username"
              error={errors.username?.message}
              {...register("username")}
              placeholder="Enter your username"
            />

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

            <Button
              type="submit"
              className="w-full"
              disabled={isSigningUp}
            >
              {isSigningUp ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Account...
                </>
              ) : (
                <>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Create Account
                </>
              )}
            </Button>
          </form>

          <div className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <a href="/login" className="text-primary hover:underline">
              Sign in
            </a>
          </div>
        </AuthCard>
      </motion.div>
    </div>
  );
}

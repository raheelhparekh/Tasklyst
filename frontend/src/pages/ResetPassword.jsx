/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthStore } from "@/store/useAuthStore.js";
import { Unlock, Loader2, EyeOff, Eye } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

const resetPasswordSchema = z
  .object({
    newPassword: z.string().min(6, "Password must be at least 6 characters"),
    newConfirmPassword: z
      .string()
      .min(6, "Confirm Password must be at least 6 characters"),
  })
  .refine((data) => data.newPassword === data.newConfirmPassword, {
    message: "Passwords do not match",
  });

function ResetPassword() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
  });

  const { resetPassword, isSubmitting } = useAuthStore();
  const token = useParams().token;

  const onSubmit = async (data) => {
    try {
      console.log("Resetting password with data:", data);
      await resetPassword(data, token);
      navigate("/login");
    } catch (error) {
      console.error("Error resetting password", error);
    }
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="flex items-center justify-center w-full h-screen bg-gray-100 dark:bg-black px-4"
    >
      <Card className="w-full max-w-md shadow-xl border border-gray-200 dark:border-gray-800">
        <CardHeader className="flex flex-col items-center">
          <Unlock size={24} color="black" />
          <CardTitle className="text-2xl text-center">Reset Password</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-4">
              <Label htmlFor="newPassword">New Password</Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showPassword ? "text" : "password"}
                  className="mt-2"
                  placeholder="••••••"
                  {...register("newPassword")}
                />
                <button
                  type="button"
                  className="absolute right-3 top-2.5 text-muted-foreground"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
                {errors.newPassword && (
                  <p className="text-red-500">{errors.newPassword.message}</p>
                )}
              </div>

              <Label htmlFor="newConfirmPassword">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="newConfirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  className="mt-2"
                  placeholder="••••••"
                  {...register("newConfirmPassword")}
                />
                <button
                  type="button"
                  className="absolute right-3 top-2.5 text-muted-foreground"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
                {errors.newConfirmPassword && (
                  <p className="text-red-500">
                    {errors.newConfirmPassword.message}
                  </p>
                )}
              </div>
            </div>
            <Button type="submit" className="w-full mt-4">
              Reset Password
              {isSubmitting && <Loader2 className="ml-2 animate-spin" />}
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default ResetPassword;

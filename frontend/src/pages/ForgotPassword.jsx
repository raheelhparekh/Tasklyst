/* eslint-disable no-unused-vars */
import React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthStore } from "@/store/useAuthStore.js";
import { Loader2, Unlock } from "lucide-react";

const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

function ForgotPassword() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
  });
  const { forgotPassword, isSubmitting } = useAuthStore();

  const onSubmit = async (email) => {
    try {
    //   console.log("email", email);
      await forgotPassword(email);
    } catch (error) {
      console.error("Error sending reset link", error);
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
          <CardTitle className="text-2xl text-center">
            Forgot Password
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  className="mt-2"
                  placeholder="Enter your email"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-red-500">{errors.email.message}</p>
                )}
              </div>
            </div>
            <Button type="submit" className="w-full mt-4">
              Send Reset Link
              {isSubmitting && <Loader2 className="ml-2 animate-spin" />}
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default ForgotPassword;

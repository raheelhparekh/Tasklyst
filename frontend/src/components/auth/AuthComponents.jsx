import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff } from "lucide-react";

export const PasswordInput = ({ label, error, ...props }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="space-y-2">
      <Label htmlFor={props.id || "password"}>{label || "Password"}</Label>
      <div className="relative">
        <Input
          type={showPassword ? "text" : "password"}
          {...props}
        />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </Button>
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
};

export const FormField = ({ label, error, children, ...props }) => (
  <div className="space-y-2">
    <Label htmlFor={props.id}>{label}</Label>
    {children || <Input {...props} />}
    {error && <p className="text-sm text-red-500">{error}</p>}
  </div>
);

export const AuthCard = ({ title, children, className = "" }) => (
  <Card className={`w-full max-w-md mx-auto ${className}`}>
    <CardHeader className="text-center">
      <CardTitle className="text-2xl font-bold">{title}</CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      {children}
    </CardContent>
  </Card>
);

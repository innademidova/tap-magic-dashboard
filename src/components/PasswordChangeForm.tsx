import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Eye, EyeOff, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";

const passwordFormSchema = z.object({
  newPassword: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(8, "Password must be at least 8 characters"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type PasswordChangeFormProps = {
  onSuccess?: () => void;
  onCancel?: () => void;
  showCancelButton?: boolean;
};

export function PasswordChangeForm({ onSuccess, onCancel, showCancelButton = true }: PasswordChangeFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<z.infer<typeof passwordFormSchema>>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  const updatePasswordMutation = useMutation({
    mutationFn: async (values: z.infer<typeof passwordFormSchema>) => {
      const { error } = await supabase.auth.updateUser({
        password: values.newPassword
      });

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Password updated successfully");
      form.reset();
      onSuccess?.();
    },
    onError: (error) => {
      toast.error("Failed to update password");
      console.error(error);
    },
  });

  return (
    <form onSubmit={form.handleSubmit((values) => updatePasswordMutation.mutate(values))} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="new-password">New Password</Label>
        <div className="relative">
          <Input
            id="new-password"
            type={showPassword ? "text" : "password"}
            {...form.register("newPassword")}
            placeholder="Enter new password"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </Button>
        </div>
        {form.formState.errors.newPassword && (
          <p className="text-sm text-red-500">{form.formState.errors.newPassword.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirm-password">Confirm Password</Label>
        <div className="relative">
          <Input
            id="confirm-password"
            type={showConfirmPassword ? "text" : "password"}
            {...form.register("confirmPassword")}
            placeholder="Confirm new password"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </Button>
        </div>
        {form.formState.errors.confirmPassword && (
          <p className="text-sm text-red-500">{form.formState.errors.confirmPassword.message}</p>
        )}
      </div>

      <div className="flex gap-2">
        {showCancelButton && (
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={() => {
              form.reset();
              onCancel?.();
            }}
          >
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          disabled={updatePasswordMutation.isPending}
          className="flex-1"
        >
          {updatePasswordMutation.isPending ? (
            <span className="flex items-center gap-2">
              <span className="animate-spin">⏳</span> Updating...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Lock className="h-4 w-4" /> Update Password
            </span>
          )}
        </Button>
      </div>
    </form>
  );
} 
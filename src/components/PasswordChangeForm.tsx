import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";

const passwordFormSchema = z.object({
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit((values) => updatePasswordMutation.mutate(values))} className="space-y-4">
        <FormField
          control={form.control}
          name="newPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input 
                    type={showPassword ? "text" : "password"} 
                    {...field} 
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
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm New Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input 
                    type={showPassword ? "text" : "password"} 
                    {...field} 
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
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-2">
          {showCancelButton && (
            <Button
              type="button"
              variant="outline"
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
            {updatePasswordMutation.isPending ? "Updating..." : "Update Password"}
          </Button>
        </div>
      </form>
    </Form>
  );
} 
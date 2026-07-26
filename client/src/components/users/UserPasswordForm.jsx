import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { resetPasswordSchema } from "../../validators/userSchema";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function FormField({
    label,
    error,
    children,
}) {
    return (
        <div className="space-y-1">
            {label && <Label className="text-xs">{label}</Label>}
            {children}
            {error && (
                <p className="text-xs text-destructive">
                    {error}
                </p>
            )}
        </div>
    );
}

export default function UserPasswordForm({
    onSubmit,
    loading,
}) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            password: "",
            confirmPassword: "",
        },
    });

    async function handleFormSubmit(data) {
        await onSubmit({ password: data.password });
    }

    return (
        <form
            onSubmit={handleSubmit(handleFormSubmit)}
            className="space-y-4"
        >
            <FormField
                label="New Password"
                error={errors.password?.message}
            >
                <Input
                    type="password"
                    autoComplete="new-password"
                    {...register("password")}
                    placeholder="At least 8 characters"
                />
            </FormField>

            <FormField
                label="Confirm Password"
                error={errors.confirmPassword?.message}
            >
                <Input
                    type="password"
                    autoComplete="new-password"
                    {...register("confirmPassword")}
                    placeholder="Re-enter password"
                />
            </FormField>

            <div className="flex justify-end">
                <Button
                    type="submit"
                    disabled={loading}
                >
                    {loading ? "Resetting..." : "Reset Password"}
                </Button>
            </div>
        </form>
    );
}

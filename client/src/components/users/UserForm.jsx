import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
    ROLE_OPTIONS,
    createUserSchema,
    updateUserSchema,
} from "../../validators/userSchema";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

function FormField({
    label,
    error,
    className,
    children,
}) {
    return (
        <div className={className ?? "space-y-1"}>
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

function buildDefaultValues(user) {
    if (!user) {
        return {
            name: "",
            email: "",
            password: "",
            role: "STAFF",
        };
    }

    return {
        name: user.name,
        email: user.email,
        role: user.role,
    };
}

export default function UserForm({
    user,
    isSelf = false,
    onSubmit,
    loading,
}) {
    const isEditing = Boolean(user);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(isEditing ? updateUserSchema : createUserSchema),
        defaultValues: buildDefaultValues(user),
    });

    const role = watch("role");

    async function handleFormSubmit(data) {
        if (isEditing) {
            const payload = {
                name: data.name.trim(),
                email: data.email.trim(),
            };

            if (!isSelf) {
                payload.role = data.role;
            }

            await onSubmit(payload);
            return;
        }

        await onSubmit({
            name: data.name.trim(),
            email: data.email.trim(),
            password: data.password,
            role: data.role,
        });
    }

    return (
        <form
            onSubmit={handleSubmit(handleFormSubmit)}
            className="space-y-4"
        >
            <div className="grid gap-3 sm:grid-cols-2">
                <FormField
                    label="Full Name"
                    error={errors.name?.message}
                    className="space-y-1 sm:col-span-2"
                >
                    <Input
                        {...register("name")}
                        placeholder="e.g. Maria Santos"
                    />
                </FormField>

                <FormField
                    label="Email"
                    error={errors.email?.message}
                    className="space-y-1 sm:col-span-2"
                >
                    <Input
                        type="email"
                        {...register("email")}
                        placeholder="user@example.com"
                    />
                </FormField>

                {!isEditing && (
                    <FormField
                        label="Password"
                        error={errors.password?.message}
                        className="space-y-1 sm:col-span-2"
                    >
                        <Input
                            type="password"
                            autoComplete="new-password"
                            {...register("password")}
                            placeholder="At least 8 characters"
                        />
                    </FormField>
                )}

                <FormField
                    label="Role"
                    error={errors.role?.message}
                    className="space-y-1 sm:col-span-2"
                >
                    <Select
                        value={role}
                        disabled={isSelf}
                        onValueChange={(value) =>
                            setValue("role", value, {
                                shouldValidate: true,
                            })
                        }
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select role" />
                        </SelectTrigger>

                        <SelectContent>
                            {ROLE_OPTIONS.map((item) => (
                                <SelectItem
                                    key={item.value}
                                    value={item.value}
                                >
                                    {item.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {isSelf && (
                        <p className="text-xs text-foreground/70">
                            You cannot change your own role. Ask another
                            administrator to update it.
                        </p>
                    )}
                </FormField>
            </div>

            <div className="flex justify-end">
                <Button
                    type="submit"
                    disabled={loading}
                >
                    {loading
                        ? "Saving..."
                        : isEditing
                            ? "Update User"
                            : "Create User"}
                </Button>
            </div>
        </form>
    );
}

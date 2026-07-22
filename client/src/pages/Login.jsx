import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import {
    Eye,
    EyeOff,
    Lock,
    Mail,
    Package,
    Scissors,
    ShoppingCart,
    Wrench,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const FEATURES = [
    {
        icon: Package,
        title: "Inventory",
        description: "Track products and stock levels",
    },
    {
        icon: ShoppingCart,
        title: "Sales",
        description: "Record transactions and invoices",
    },
    {
        icon: Wrench,
        title: "Repairs",
        description: "Manage repair orders and pickups",
    },
];

export default function Login() {
    const { login, isAuthenticated, loading: authLoading } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    if (authLoading) {
        return (
            <div className="flex min-h-svh items-center justify-center bg-muted/30">
                <p className="text-sm text-muted-foreground">
                    Loading...
                </p>
            </div>
        );
    }

    if (isAuthenticated) {
        return <Navigate to="/dashboard" replace />;
    }

    async function handleSubmit(event) {
        event.preventDefault();

        setLoading(true);
        setError("");

        try {
            await login(email, password);
            navigate("/dashboard");
        } catch (err) {
            setError(
                err.response?.data?.message
                    ?? "Invalid email or password. Please try again."
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex min-h-svh text-left">
            <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-primary p-10 text-primary-foreground lg:flex">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.12),transparent_55%)]" />
                <div className="absolute -right-16 -bottom-16 h-64 w-64 rounded-full bg-white/5" />
                <div className="absolute top-1/3 -left-10 h-40 w-40 rounded-full bg-white/5" />

                <div className="relative flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                        <Scissors className="h-5 w-5" />
                    </div>
                    <span className="text-xl font-semibold tracking-tight">
                        SewTrack
                    </span>
                </div>

                <div className="relative space-y-8">
                    <div className="space-y-3">
                        <h1 className="text-3xl font-semibold tracking-tight text-balance">
                            Your sewing shop, organized.
                        </h1>
                        <p className="max-w-md text-sm leading-relaxed text-primary-foreground/75">
                            Manage inventory, sales, repairs, and expenses
                            in one place — built for tailoring and
                            alteration businesses.
                        </p>
                    </div>

                    <div className="space-y-4">
                        {FEATURES.map((feature) => (
                            <div
                                key={feature.title}
                                className="flex items-start gap-3"
                            >
                                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10">
                                    <feature.icon className="h-4 w-4" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium">
                                        {feature.title}
                                    </p>
                                    <p className="text-xs text-primary-foreground/65">
                                        {feature.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <p className="relative text-xs text-primary-foreground/50">
                    SewTrack &copy; {new Date().getFullYear()}
                </p>
            </div>

            <div className="flex flex-1 flex-col items-center justify-center bg-muted/30 px-6 py-12">
                <div className="mb-8 flex items-center gap-2 lg:hidden">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                        <Scissors className="h-4 w-4" />
                    </div>
                    <span className="text-lg font-semibold tracking-tight">
                        SewTrack
                    </span>
                </div>

                <Card className="w-full max-w-sm shadow-lg">
                    <CardHeader className="text-center">
                        <CardTitle className="text-xl">
                            Welcome back
                        </CardTitle>
                        <CardDescription>
                            Sign in to your account to continue
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <form
                            onSubmit={handleSubmit}
                            className="space-y-4"
                        >
                            {error && (
                                <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2.5 text-sm text-destructive">
                                    {error}
                                </div>
                            )}

                            <div className="space-y-2">
                                <Label htmlFor="email">
                                    Email
                                </Label>
                                <div className="relative">
                                    <Mail className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="you@example.com"
                                        className="pl-9"
                                        value={email}
                                        onChange={(event) =>
                                            setEmail(event.target.value)
                                        }
                                        required
                                        autoComplete="email"
                                        autoFocus
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">
                                    Password
                                </Label>
                                <div className="relative">
                                    <Lock className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Enter your password"
                                        className="pr-9 pl-9"
                                        value={password}
                                        onChange={(event) =>
                                            setPassword(event.target.value)
                                        }
                                        required
                                        autoComplete="current-password"
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon-sm"
                                        className="absolute top-1/2 right-1 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                        onClick={() =>
                                            setShowPassword((current) => !current)
                                        }
                                        aria-label={
                                            showPassword
                                                ? "Hide password"
                                                : "Show password"
                                        }
                                    >
                                        {showPassword
                                            ? <EyeOff className="h-4 w-4" />
                                            : <Eye className="h-4 w-4" />}
                                    </Button>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full"
                                size="lg"
                                disabled={loading}
                            >
                                {loading ? "Signing in..." : "Sign in"}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <p className="mt-8 text-center text-xs text-muted-foreground lg:hidden">
                    SewTrack &copy; {new Date().getFullYear()}
                </p>
            </div>
        </div>
    );
}

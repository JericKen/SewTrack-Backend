import { useLocation, useNavigate } from "react-router-dom";
import { ChevronDown, LogOut } from "lucide-react";

import { useAuth } from "../../context/AuthContext";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"; 
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

const PAGE_META = {
    "/dashboard": {
        title: "Dashboard",
        description: "Overview of your business",
    },
    "/products": {
        title: "Products",
        description: "Manage your catalog, pricing, and stock",
    },
    "/categories": {
        title: "Categories",
        description: "Organize products by category",
    },
    "/suppliers": {
        title: "Suppliers",
        description: "Manage supplier contacts",
    },
    "/customers": {
        title: "Customers",
        description: "Manage customer records",
    },
    "/sales": {
        title: "Sales",
        description: "Record sales and track invoices",
    },
    "/purchases": {
        title: "Purchases",
        description: "Track stock purchases",
    },
    "/repairs": {
        title: "Repairs",
        description: "Manage repair orders",
    },
    "/expenses": {
        title: "Expenses",
        description: "Track business expenses",
    },
    "/reports": {
        title: "Reports",
        description: "View business reports",
    },
    "/users": {
        title: "Users",
        description: "Manage staff accounts",
    },
    "/inventory": {
        title: "Inventory",
        description: "Monitor stock movements",
    },
};

const ROLE_LABELS = {
    ADMIN: "Admin",
    STAFF: "Staff",
};

function getInitials(name) {
    if (!name) {
        return "?";
    }

    return name
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();
}

export default function AppHeader() {
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const page = PAGE_META[location.pathname] ?? {
        title: "SewTrack",
        description: "Business management",
    };

    function handleLogout() {
        logout();
        navigate("/", { replace: true });
    }

    return (
        <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center gap-3 border-b bg-background/95 px-4 backdrop-blur supports-backdrop-filter:bg-background/80 sm:px-6">
            <SidebarTrigger className="-ml-1" />

            <Separator
                orientation="vertical"
                className="hidden h-4 sm:block"
            />

            <div className="min-w-0 flex-1 text-left">
                <h1 className="truncate text-sm font-semibold tracking-tight">
                    {page.title}
                </h1>
                <p className="hidden truncate text-xs text-muted-foreground sm:block">
                    {page.description}
                </p>
            </div>

            <DropdownMenu>
                <DropdownMenuTrigger
                    render={
                        <Button
                            variant="ghost"
                            className="h-9 gap-2 px-2 hover:bg-muted"
                        />
                    }
                >
                    <Avatar size="sm">
                        <AvatarFallback className="bg-primary/10 text-xs font-medium text-primary">
                            {getInitials(user?.name)}
                        </AvatarFallback>
                    </Avatar>

                    <div className="hidden min-w-0 text-left md:block">
                        <p className="truncate text-sm font-medium leading-none">
                            {user?.name}
                        </p>
                        <p className="mt-0.5 truncate text-xs text-muted-foreground">
                            {ROLE_LABELS[user?.role] ?? user?.role}
                        </p>
                    </div>

                    <ChevronDown className="hidden h-4 w-4 text-muted-foreground md:block" />
                </DropdownMenuTrigger>

                <DropdownMenuContent
                    align="end"
                    className="w-56"
                >
                    <DropdownMenuGroup>
                        <DropdownMenuLabel className="font-normal">
                            <div className="flex flex-col gap-1.5">
                                <p className="text-sm font-medium leading-none">
                                    {user?.name}
                                </p>
                                <p className="text-xs font-normal text-muted-foreground">
                                    {user?.email}
                                </p>
                                <Badge
                                    variant="secondary"
                                    className="w-fit"
                                >
                                    {ROLE_LABELS[user?.role] ?? user?.role}
                                </Badge>
                            </div>
                        </DropdownMenuLabel>
                    </DropdownMenuGroup>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem
                        variant="destructive"
                        onClick={handleLogout}
                    >
                        <LogOut />
                        Log out
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </header>
    );
}

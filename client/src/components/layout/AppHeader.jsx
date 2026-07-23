import { useNavigate } from "react-router-dom";
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
import { SidebarTrigger } from "@/components/ui/sidebar";

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
    const navigate = useNavigate();

    function handleLogout() {
        logout();
        navigate("/", { replace: true });
    }

    return (
        <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center justify-between gap-3 border-b bg-background px-4 sm:px-6">
            <SidebarTrigger className="-ml-1" />

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

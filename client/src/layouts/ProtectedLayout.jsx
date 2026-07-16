import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import AppSidebar from "../components/layout/AppSidebar";
import AppHeader from "../components/layout/AppHeader";

import {
    SidebarProvider,
    SidebarInset,
} from "@/components/ui/sidebar";

export default function ProtectedLayout() {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    return (
        <SidebarProvider>

            <AppSidebar />

            <SidebarInset>

                <AppHeader />

                <div className="flex-1 p-6 bg-muted/30">
                    <Outlet />
                </div>

            </SidebarInset>

        </SidebarProvider>
    );
}
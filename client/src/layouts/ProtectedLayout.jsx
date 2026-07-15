import { Navigate, Outlet } from "react-router-dom";

import { SidebarProvider } from "@/components/ui/sidebar";

import AppSidebar from "../components/layout/AppSidebar";

import AppHeader from "../components/layout/AppHeader";

import { useAuth } from "../context/AuthContext";

export default function ProtectedLayout() {

    const {

        loading,

        isAuthenticated

    } = useAuth();

    if (loading) {

        return <div>Loading...</div>;

    }

    if (!isAuthenticated) {

        return <Navigate to="/" replace />;

    }

    return (

        <SidebarProvider>

            <AppSidebar />

            <main className="flex-1 flex flex-col">

                <AppHeader />

                <div className="p-6 bg-gray-50 min-h-screen">

                    <Outlet />

                </div>

            </main>

        </SidebarProvider>

    );

}
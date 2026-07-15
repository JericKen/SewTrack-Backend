import { useAuth } from "../../context/AuthContext";

import { SidebarTrigger } from "@/components/ui/sidebar";

export default function AppHeader() {

    const { user } = useAuth();

    return (

        <header className="h-16 border-b flex items-center justify-between px-6 bg-white">

            <div className="flex items-center gap-3">

                <SidebarTrigger />

                <h1 className="font-semibold text-lg">
                    SewTrack
                </h1>

            </div>

            <div className="font-medium">

                {user?.name}

            </div>

        </header>

    );

}
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

export default function ProtectedLayout() {

    const { loading, isAuthenticated } = useAuth();

    if (loading) {
        return <h2>Loading...</h2>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    return (
        <div style={{ display: "flex", minHeight: "100vh" }}>

            <Sidebar />

            <div
                style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column"
                }}
            >

                <Topbar />

                <main
                    style={{
                        padding: "24px",
                        background: "#f5f5f5",
                        flex: 1
                    }}
                >
                    <Outlet />
                </main>

            </div>

        </div>
    );
}
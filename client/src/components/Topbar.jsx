import { useAuth } from "../context/AuthContext";

export default function Topbar() {

    const { user } = useAuth();

    return (
        <header
            style={{
                height: 70,
                background: "#fff",
                borderBottom: "1px solid #ddd",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "0 24px",  
            }}
        >
            <h3>Dashboard</h3>

            <div>
                Welcome, <strong>{user?.name}</strong>
            </div>
        </header>
    );
}
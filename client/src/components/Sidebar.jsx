import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Sidebar() {

    const { logout } = useAuth();

    return (
        <aside
            style={{
                width: 250,
                background: "#222",
                color: "#fff",
                padding: 20
            }}
        >
            <h2>SewTrack</h2>

            <nav
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 10
                }}
            >
                <NavLink to="/dashboard">Dashboard</NavLink>

                <NavLink to="/products">Products</NavLink>

                <NavLink to="/categories">Categories</NavLink>

                <NavLink to="/suppliers">Suppliers</NavLink>

                <NavLink to="/customers">Customers</NavLink>

                <NavLink to="/inventory">Inventory</NavLink>

                <NavLink to="/sales">Sales</NavLink>

                <NavLink to="/purchases">Purchases</NavLink>

                <NavLink to="/repairs">Repair Orders</NavLink>

                <NavLink to="/expenses">Expenses</NavLink>

                <NavLink to="/reports">Reports</NavLink>

                <NavLink to="/users">Users</NavLink>

                <button
                    onClick={logout}
                    style={{ marginTop: 20 }}
                >
                    Logout
                </button>
            </nav>
        </aside>
    );
}
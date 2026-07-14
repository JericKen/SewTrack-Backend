import { useEffect, useState } from "react";
import SummaryCard from "../components/SummaryCard";
import { getDashboard } from "../services/dashboardService";
import { formatCurrency } from "../utils/currency";

export default function Dashboard() {

    const [dashboard, setDashboard] = useState(null);

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        async function loadDashboard() {

            try {

                const response = await getDashboard();

                setDashboard(response.data);

            } catch (error) {

                console.error(error);

            } finally {

                setLoading(false);

            }

        }

        loadDashboard();

    }, []);

    if (loading) {
        return <h2>Loading...</h2>;
    }

    return (

        <>
            <h1>Dashboard</h1>

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(4, 1fr)",
                    gap: 20
                }}
            >

                <SummaryCard
                    title="Today's Sales"
                    value={formatCurrency(dashboard.sales.today)}
                />

                <SummaryCard
                    title="Today's Expenses"
                    value={formatCurrency(dashboard.expenses.today)}
                />

                <SummaryCard
                    title="Monthly Profit"
                    value={formatCurrency(dashboard.profit.month)}
                />

                <SummaryCard
                    title="Customers"
                    value={dashboard.customers.total}
                />

            </div>

        </>

    );

}
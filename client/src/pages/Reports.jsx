import { useCallback, useEffect, useMemo, useState } from "react";

import ReportSummary from "../components/reports/ReportSummary";
import ReportTable from "../components/reports/ReportTable";
import ReportToolbar from "../components/reports/ReportToolbar";

import { getCategories } from "../services/categoryService";
import {
    getExpenseReport,
    getInventoryReport,
    getProfitReport,
    getRepairReport,
    getSalesReport,
} from "../services/reportService";

import { getMonthStartISO, getTodayISO } from "../utils/date";

import { Button } from "@/components/ui/button";

function buildReportParams({
    reportType,
    startDate,
    endDate,
    category,
    paymentMethod,
    inventoryCategory,
    inventoryStatus,
    repairStatus,
}) {
    if (reportType === "sales" || reportType === "profit") {
        const params = {};

        if (startDate) {
            params.startDate = startDate;
        }

        if (endDate) {
            params.endDate = endDate;
        }

        return params;
    }

    if (reportType === "expenses") {
        const params = {};

        if (startDate) {
            params.startDate = startDate;
        }

        if (endDate) {
            params.endDate = endDate;
        }

        if (category !== "ALL") {
            params.category = category;
        }

        if (paymentMethod !== "ALL") {
            params.paymentMethod = paymentMethod;
        }

        return params;
    }

    if (reportType === "inventory") {
        const params = {};

        if (inventoryCategory !== "ALL") {
            params.category = inventoryCategory;
        }

        if (inventoryStatus !== "ALL") {
            params.status = inventoryStatus;
        }

        return params;
    }

    if (reportType === "repairs") {
        const params = {};

        if (startDate) {
            params.startDate = startDate;
        }

        if (endDate) {
            params.endDate = endDate;
        }

        if (repairStatus !== "ALL") {
            params.status = repairStatus;
        }

        return params;
    }

    return {};
}

async function fetchReport(reportType, params) {
    switch (reportType) {
        case "sales":
            return getSalesReport(params);
        case "expenses":
            return getExpenseReport(params);
        case "profit":
            return getProfitReport(params);
        case "inventory":
            return getInventoryReport(params);
        case "repairs":
            return getRepairReport(params);
        default:
            return null;
    }
}

export default function Reports() {
    const [reportType, setReportType] = useState("sales");
    const [startDate, setStartDate] = useState(getMonthStartISO);
    const [endDate, setEndDate] = useState(getTodayISO);
    const [category, setCategory] = useState("ALL");
    const [paymentMethod, setPaymentMethod] = useState("ALL");
    const [inventoryCategory, setInventoryCategory] = useState("ALL");
    const [inventoryStatus, setInventoryStatus] = useState("ALL");
    const [repairStatus, setRepairStatus] = useState("ALL");

    const [categories, setCategories] = useState([]);
    const [summary, setSummary] = useState(null);
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let cancelled = false;

        async function loadCategories() {
            try {
                const response = await getCategories();
                if (!cancelled) {
                    setCategories(response.data ?? []);
                }
            } catch (loadError) {
                console.error(loadError);
            }
        }

        loadCategories();

        return () => {
            cancelled = true;
        };
    }, []);

    const queryParams = useMemo(
        () => buildReportParams({
            reportType,
            startDate,
            endDate,
            category,
            paymentMethod,
            inventoryCategory,
            inventoryStatus,
            repairStatus,
        }),
        [
            reportType,
            startDate,
            endDate,
            category,
            paymentMethod,
            inventoryCategory,
            inventoryStatus,
            repairStatus,
        ]
    );

    const loadReport = useCallback(async () => {
        try {
            setError(null);
            setLoading(true);

            const response = await fetchReport(reportType, queryParams);
            const report = response?.data ?? null;

            setSummary(report?.summary ?? null);
            setRows(report?.data ?? []);
        } catch (loadError) {
            console.error(loadError);
            setSummary(null);
            setRows([]);
            setError(
                loadError.response?.data?.message
                    ?? "Could not load report. Please try again."
            );
        } finally {
            setLoading(false);
        }
    }, [reportType, queryParams]);

    useEffect(() => {
        loadReport();
    }, [loadReport]);

    const dateRangeLabel = useMemo(() => {
        if (reportType === "inventory") {
            return "Current inventory snapshot";
        }

        if (!startDate && !endDate) {
            return "All dates";
        }

        if (startDate && endDate) {
            return `${startDate} to ${endDate}`;
        }

        if (startDate) {
            return `From ${startDate}`;
        }

        return `Through ${endDate}`;
    }, [reportType, startDate, endDate]);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="font-heading text-2xl font-semibold tracking-tight">
                    Reports
                </h1>
                <p className="mt-1 text-muted-foreground">
                    Sales, spending, inventory, and repair analytics for{" "}
                    {dateRangeLabel}.
                </p>
            </div>

            <ReportToolbar
                reportType={reportType}
                setReportType={setReportType}
                startDate={startDate}
                setStartDate={setStartDate}
                endDate={endDate}
                setEndDate={setEndDate}
                category={category}
                setCategory={setCategory}
                paymentMethod={paymentMethod}
                setPaymentMethod={setPaymentMethod}
                inventoryCategory={inventoryCategory}
                setInventoryCategory={setInventoryCategory}
                inventoryStatus={inventoryStatus}
                setInventoryStatus={setInventoryStatus}
                repairStatus={repairStatus}
                setRepairStatus={setRepairStatus}
                categories={categories}
                loading={loading}
                onRefresh={loadReport}
                rowCount={reportType === "profit" ? null : rows.length}
            />

            {error && (
                <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-destructive/30 bg-destructive/5 p-8 text-center">
                    <p className="max-w-md text-sm text-destructive">
                        {error}
                    </p>
                    <Button variant="outline" onClick={loadReport}>
                        Try again
                    </Button>
                </div>
            )}

            {!error && (
                <>
                    <ReportSummary
                        reportType={reportType}
                        summary={summary}
                        loading={loading}
                    />

                    <ReportTable
                        reportType={reportType}
                        rows={rows}
                        loading={loading}
                    />
                </>
            )}
        </div>
    );
}

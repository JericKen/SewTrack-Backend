import api from "../api/axios";

export async function getSalesReport(params = {}) {
    const response = await api.get("/reports/sales", { params });
    return response.data;
}

export async function getExpenseReport(params = {}) {
    const response = await api.get("/reports/expenses", { params });
    return response.data;
}

export async function getInventoryReport(params = {}) {
    const response = await api.get("/reports/inventory", { params });
    return response.data;
}

export async function getRepairReport(params = {}) {
    const response = await api.get("/reports/repairs", { params });
    return response.data;
}

export async function getProfitReport(params = {}) {
    const response = await api.get("/reports/profit", { params });
    return response.data;
}

import api from "../api/axios";

export async function getExpenses(params = {}) {
    const response = await api.get("/expenses", { params });
    return response.data;
}

export async function getExpenseSummary() {
    const response = await api.get("/expenses/summary");
    return response.data;
}

export async function getExpenseById(id) {
    const response = await api.get(`/expenses/${id}`);
    return response.data;
}

export async function createExpense(data) {
    const response = await api.post("/expenses", data);
    return response.data;
}

export async function updateExpense(id, data) {
    const response = await api.patch(`/expenses/${id}`, data);
    return response.data;
}

export async function archiveExpense(id) {
    const response = await api.delete(`/expenses/${id}`);
    return response.data;
}

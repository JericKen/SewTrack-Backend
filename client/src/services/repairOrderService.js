import api from "../api/axios";

export async function getRepairOrders(params = {}) {
    const response = await api.get("/repair-orders", { params });
    return response.data;
}

export async function getRepairOrderById(id) {
    const response = await api.get(`/repair-orders/${id}`);
    return response.data;
}

export async function createRepairOrder(data) {
    const response = await api.post("/repair-orders", data);
    return response.data;
}

export async function updateRepairOrder(id, data) {
    const response = await api.patch(`/repair-orders/${id}`, data);
    return response.data;
}

export async function updateRepairStatus(id, status) {
    const response = await api.patch(`/repair-orders/${id}/status`, { status });
    return response.data;
}

export async function cancelRepairOrder(id) {
    const response = await api.patch(`/repair-orders/${id}/cancel`);
    return response.data;
}

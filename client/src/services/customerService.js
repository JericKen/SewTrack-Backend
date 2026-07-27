import api from "../api/axios";

export async function getCustomers(params = {}) {
    const response = await api.get("/customers", { params });
    return response.data;
}

export async function getCustomerById(id) {
    const response = await api.get(`/customers/${id}`);
    return response.data;
}

export async function createCustomer(data) {
    const response = await api.post("/customers", data);
    return response.data;
}

export async function updateCustomer(id, data) {
    const response = await api.patch(`/customers/${id}`, data);
    return response.data;
}

export async function archiveCustomer(id) {
    const response = await api.delete(`/customers/${id}`);
    return response.data;
}

export async function getCustomerRepairHistory(id) {
    const response = await api.get(`/customers/${id}/repairs`);
    return response.data;
}

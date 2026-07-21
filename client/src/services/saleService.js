import api from "../api/axios";

export async function getSales(params = {}) {
    const response = await api.get("/sales", { params });
    return response.data;
}

export async function getSaleById(id) {
    const response = await api.get(`/sales/${id}`);
    return response.data;
}

export async function createSale(data) {
    const response = await api.post("/sales", data);
    return response.data;
}

export async function voidSale(id) {
    const response = await api.post(`/sales/${id}/void`);
    return response.data;
}

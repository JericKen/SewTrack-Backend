import api from "../api/axios";

export async function getSuppliers(params = {}) {
    const response = await api.get("/suppliers", { params });
    return response.data;
}

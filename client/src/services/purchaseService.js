import api from "../api/axios";

export async function getPurchases(params = {}) {
    const response = await api.get("/purchases", { params });
    return response.data;
}

export async function createPurchase(data) {
    const response = await api.post("/purchases", data);
    return response.data;
}

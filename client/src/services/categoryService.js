import api from "../api/axios";

export async function getCategories() {
    const response = await api.get("/categories");
    return response.data;
}
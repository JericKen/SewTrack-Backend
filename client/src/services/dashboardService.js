import api from "../api/axios";

export async function getDashboard() {

    const response = await api.get("/dashboard");

    return response.data;

}
import api from "../api/axios";

export async function getUsers() {
    const response = await api.get("/users");
    return response.data;
}

export async function createUser(data) {
    const response = await api.post("/users", data);
    return response.data;
}

export async function updateUser(id, data) {
    const response = await api.put(`/users/${id}`, data);
    return response.data;
}

export async function resetUserPassword(id, password) {
    const response = await api.patch(`/users/${id}/password`, { password });
    return response.data;
}

export async function archiveUser(id) {
    const response = await api.patch(`/users/${id}/archive`);
    return response.data;
}

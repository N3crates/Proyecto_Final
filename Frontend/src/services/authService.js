import api from "./api";

export const loginRequest = async (Credentials) => {
    const response = await api.post('/auth/login', Credentials)
    return response.data
}
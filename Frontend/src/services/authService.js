import api from "./api";

export const loginRequest = async (Credentials) => {
    const response = await api.post('/auth/login', Credentials)
    return response.data
}

export async function meRequest() {
    const response = await api.get('/auth/me')

    return response.data
}
import api from "./api";
import { ENDPOINTS } from "../constants/endpoints";

export const loginRequest = async (Credentials) => {
    const response = await api.post(ENDPOINTS.AUTH.LOGIN, Credentials)
    return response.data
}

export async function meRequest() {
    const response = await api.get(ENDPOINTS.AUTH.ME)

    return response.data
}
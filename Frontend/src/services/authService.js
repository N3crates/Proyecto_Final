import api from "./api";
import { ENDPOINTS } from "../constants/endpoints";

export async function loginRequest(credentials){
    const { data } = await api.post(ENDPOINTS.AUTH.LOGIN, credentials)
    return data
}

export async function meRequest() {
    const { data } = await api.get(ENDPOINTS.AUTH.ME)

    return data
}
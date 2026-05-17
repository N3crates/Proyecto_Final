import api from "./api";
import { ENDPOINTS } from "../constants/endpoints";

export async function getRoles() {
    const { data } = await api.get(ENDPOINTS.ROLES.BASE)
    return data.items || []
}
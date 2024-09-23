import axios from "axios";
import {API_HOST} from "../core/env";
import {getAccessToken, isAccessTokenExpired} from "../core/storage/tokens";
import {addToHeaderToken} from "./apiCore";
import {refreshToken} from "./auth/common";

export const credentialsRequest = axios.create({
    baseURL: API_HOST,
    withCredentials: true,
})


credentialsRequest.interceptors.request.use(async (config) => {
    try {
        if (isAccessTokenExpired()) {
            await refreshToken()
        }
    } catch (error) {
        return Promise.reject(error);
    }

    addToHeaderToken(config, getAccessToken)
    return config;
})
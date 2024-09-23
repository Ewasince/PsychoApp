import axios, {AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig} from "axios";
import {getAccessToken, isAccessTokenExpired, setTokenData} from "../core/storage/tokens";
import {API_HOST} from "../core/env";
import {IAuthResponse, REFRESH_URL} from "./endpoints/apiAuth";
import {setUser} from "./userControl";

export const credentialsRequest = axios.create({
    baseURL: API_HOST,
    withCredentials: true,
})
export const regularRequest = axios.create({
    baseURL: API_HOST,
    withCredentials: true,
})

export const refreshRequest = axios.create({
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

    addToHeaderCors(config)
    addToHeaderToken(config, getAccessToken)
    return config;
})

regularRequest.interceptors.request.use((config) => {
    addToHeaderCors(config)
    return config;
})

refreshRequest.interceptors.request.use((config) => {
    addToHeaderCors(config)
    addToHeaderToken(config, getAccessToken)
    return config;
})

function addToHeaderToken(config: InternalAxiosRequestConfig<any>, tokenFunc: () => string) {
    if (!config.headers) {
        return
    }
    const token = tokenFunc()
    config.headers.Authorization = "Bearer " + token || ''
}

function addToHeaderCors(config: InternalAxiosRequestConfig<any>) {
    if (!config.headers) {
        return
    }
    // config.headers["Access-Control-Allow-Origin"] = "*"
    // config.headers["Access-Control-Allow-Headers"] = "Origin, X-Requested-With, Content-Type, Accept"
}

function generateUrl(baseUrl: string, urlParams: Array<string>): string {
    let url = baseUrl;
    if (urlParams.length) {
        urlParams.forEach(function (param) {
            url = url + `/${param}`
        })
    }
    return url
}


export function makePost<REQ, RES>(endpoint: string, withoutCreds?: boolean, refresh?: boolean) {
    return function (data?: REQ, config?: AxiosRequestConfig<REQ>, ...urlParams: string[]) {
        const baseRequest = withoutCreds ? regularRequest : !refresh ? credentialsRequest : refreshRequest
        return baseRequest.post<RES, AxiosResponse<RES>, REQ>(
            generateUrl(endpoint, urlParams),
            data,
            config,
        )
    }
}


export function makePatch<REQ, RES>(endpoint: string, withoutCreds?: boolean) {
    return function (data?: REQ, config?: AxiosRequestConfig<REQ>, ...urlParams: string[]) {
        const baseRequest = withoutCreds ? regularRequest : credentialsRequest
        return baseRequest.patch<RES, AxiosResponse<RES>, REQ>(
            generateUrl(endpoint, urlParams),
            data,
            config,
        )
    }
}


export function makeGet<RES>(endpoint: string, withoutCreds?: boolean) {
    return function (config?: AxiosRequestConfig, ...urlParams: string[]) {
        const baseRequest = withoutCreds ? regularRequest : credentialsRequest

        return baseRequest.get<RES>(
            generateUrl(endpoint, urlParams),
            config,
        )
    }
}


export async function postRefresh() {
    return await refreshRequest.post<IAuthResponse>(
        REFRESH_URL
    )
}

export async function refreshToken() {
    const res = await postRefresh()
    const tokenData = res.data;
    setTokenData(tokenData)
    setUser();
}

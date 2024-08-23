import axios, {AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig} from "axios";
import {getAccessToken, getRefreshToken} from "../core/storage/tokens";

export function makeUrl(endpoint: string) {
    return `http://localhost:8181/${endpoint}`
}

export const credentialsRequest = axios.create({
    baseURL: makeUrl(""),
    withCredentials: true,
})
export const regularRequest = axios.create({
    baseURL: makeUrl(""),
    withCredentials: true,
})

export const refreshRequest = axios.create({
    baseURL: makeUrl(""),
    withCredentials: true,
})


credentialsRequest.interceptors.request.use((config) => {
    addToHeaderCors(config)
    addToHeaderToken(config, getAccessToken)

    console.log("credentialsRequest config.headers", config.headers)
    return config;
})

regularRequest.interceptors.request.use((config) => {
    addToHeaderCors(config)

    console.log("regularRequest config.headers", config.headers)
    return config;
})

refreshRequest.interceptors.request.use((config) => {
    addToHeaderCors(config)
    addToHeaderToken(config, getRefreshToken)

    console.log("refreshRequest config.headers", config.headers)
    return config;
})

function addToHeaderToken(config: InternalAxiosRequestConfig<any>, tokenFunc: () => string ){
    if (!config.headers){
        return
    }
    const token = tokenFunc()
    config.headers.Authorization = "Bearer " + token || ''
}

function addToHeaderCors(config: InternalAxiosRequestConfig<any>){
    if (!config.headers){
        return
    }
    config.headers["Access-Control-Allow-Origin"] = "*"
    config.headers["Access-Control-Allow-Headers"] = "Origin, X-Requested-With, Content-Type, Accept"
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
        const baseUrl = makeUrl(endpoint)
        return baseRequest.post<RES, AxiosResponse<RES>, REQ>(
            generateUrl(baseUrl, urlParams),
            data,
            config,
        )
    }
}


export function makePatch<REQ, RES>(endpoint: string, withoutCreds?: boolean) {
    return function (data?: REQ, config?: AxiosRequestConfig<REQ>, ...urlParams: string[]) {
        const baseRequest = withoutCreds ? regularRequest : credentialsRequest
        const baseUrl = makeUrl(endpoint)
        return baseRequest.patch<RES, AxiosResponse<RES>, REQ>(
            generateUrl(baseUrl, urlParams),
            data,
            config,
        )
    }
}


export function makeGet<RES>(endpoint: string, withoutCreds?: boolean) {
    return function (config?: AxiosRequestConfig, ...urlParams: string[]) {
        const baseRequest = withoutCreds ? regularRequest : credentialsRequest
        const baseUrl = makeUrl(endpoint)

        return baseRequest.get<RES>(
            generateUrl(baseUrl, urlParams),
            config,
        )
    }
}
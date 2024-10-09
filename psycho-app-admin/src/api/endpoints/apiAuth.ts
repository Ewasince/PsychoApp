import {credentialsEmptyRequest, refreshRequest} from "../requestAuth";


export const LOGIN_URL = "api/auth/login";
export const REFRESH_URL = "api/auth/refresh_token";

export const SIGN_UP = "api/auth/sing_up";
export const GET_CONFIG_URL = "api/auth/config";

export type IMe = {
    id: string
    username: string
    email: string
}


export type IReg = {
    name: string;
    email: string;
    username: string;
    password: string;
    // email: string;
    // phone: string;
    // firstname: string;
    // lastname: string;
    // isTutor: boolean;
}

export type IAuthResponse = {
    // access_token: string;
    // refresh_token: string;
    token: string;
    expire: number; // iso date
}

export type ILogin = {
    username: string;
    password: string;
    // email: string;
    // phone: string;
    // firstname: string;
    // lastname: string;
    // isTutor: boolean;
}

export type IConfig = {
    is_dev: boolean
}

export const postSingUp = async (regForm: IReg) => {
    return await credentialsEmptyRequest.post(
        SIGN_UP,
        regForm,
    )
}

export const postLogin = async (regForm: ILogin) => {
    return await credentialsEmptyRequest.post<IAuthResponse>(
        LOGIN_URL,
        regForm,
    )
}


export const postRefresh = async () => {
    return await refreshRequest.post<IAuthResponse>(
        REFRESH_URL
    )
}

export const getConfigFromBack = async () => {
    return await credentialsEmptyRequest.get<IConfig>(
        GET_CONFIG_URL,
    )
}

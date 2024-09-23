import {credentialsEmptyRequest, refreshRequest} from "../requestAuth";


export const LOGIN_URL = "api/auth/login";
export const REFRESH_URL = "api/auth/refresh_token";
export const GET_ME_URL = "api/auth/get_me";

export const SIGN_UP_STUDENT_URL = "api/auth/student/register";
export const SIGN_UP_TUTOR_URL = "api/auth/tutor/register";
// export const SIGN_UP_SUPPORT_URL = "api/auth/support/register";
// auth

export type IMe = {
    id: string
    username: string
    email: string
}

export type IConfig = {
    // accessRights: {
    //     isTutor?: boolean,
    //     isStudent?: boolean,
    // },
    // userId: string
    is_dev: boolean
}
export type IMeResponse = {
    user: IMe
    config: IConfig
}

export type IReg = {
    username: string;
    password: string;
    fio: string;
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

export const postSingUpStudent = async (regForm: IReg) => {
    return await credentialsEmptyRequest.post<IAuthResponse>(
        SIGN_UP_STUDENT_URL,
        regForm,
    )
}

export const postSingUpTutor = async (regForm: IReg) => {
    return await credentialsEmptyRequest.post<IAuthResponse>(
        SIGN_UP_TUTOR_URL,
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

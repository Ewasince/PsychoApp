// auth
import {makeGet, makePost} from "../apiCore";


export const LOGIN_URL = "login";
export const REFRESH_URL = "api/auth/refresh_token";
export const GET_ME_URL = "api/auth/get_me";

export const SIGN_UP_STUDENT_URL = "api/auth/student/register";
export const SIGN_UP_TUTOR_URL = "api/auth/tutor/register";
// export const SIGN_UP_SUPPORT_URL = "api/auth/support/register";
// auth

export type IMe = {
    id: string, // "31962d5e-7cff-4c47-8cdb-142d5689e9d4",
    // "created_at": Date, // "2024-04-28T12:45:18.640096",
    // "updated_at": Date, // null,
    username: string, // "qwer",
    // "password_hash": string, // "$2b$12$E85m0tMdHiMNxPlmJ/5jleDfmLkjJWfskUo1evBcQ8bTNVFlaKQFK",
    // "role": EnumRole, // "STUDENT"
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
    expire: string; // iso date
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

export const postSingUpStudent = makePost<IReg, IAuthResponse>(
    SIGN_UP_STUDENT_URL,
    true,
)
export const postSingUpTutor = makePost<IReg, IAuthResponse>(
    SIGN_UP_TUTOR_URL,
    true,
)

export const postLogin = makePost<ILogin, IAuthResponse>(
    LOGIN_URL,
    true,
)
export const getMe = makeGet<IMe>(
    GET_ME_URL,
)

export const postRefresh = makePost<null, IAuthResponse>(
    REFRESH_URL,
    false,
    true,
)

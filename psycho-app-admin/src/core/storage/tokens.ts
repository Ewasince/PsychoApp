import {IAuthResponse} from "../../api/endpoints/apiAuth";

let ACCESS_TOKEN_KEY = "access_token"
let REFRESH_TOKEN_KEY = "refresh_token"


export function setTokens(tokensData: IAuthResponse) {
    localStorage.setItem(ACCESS_TOKEN_KEY, tokensData.access_token);
    localStorage.setItem(REFRESH_TOKEN_KEY, tokensData.refresh_token);
}

export function saveAccessToken(access_token: string) {
    localStorage.setItem(ACCESS_TOKEN_KEY, access_token);
}

export function getAccessToken(): string {
    const token = localStorage.getItem(ACCESS_TOKEN_KEY)
    return token || ''
}

export function getRefreshToken(): string {
    const token = localStorage.getItem(REFRESH_TOKEN_KEY)
    return token || ''
}

export function clearTokens() {
    setTokens({
        access_token: '',
        refresh_token: '',
    })
}
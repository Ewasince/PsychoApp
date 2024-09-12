import {IAuthResponse} from "../../api/endpoints/apiAuth";

let ACCESS_TOKEN_KEY = "access_token"
// let REFRESH_TOKEN_KEY = "refresh_token"
let REFRESH_TOKEN_KEY = ACCESS_TOKEN_KEY
let EXPIRE_TOKEN_KEY = "expire_token"


export function setTokenData(tokensData: IAuthResponse) {
    setAccessToken(tokensData.token)
    setAccessTokenExpire(tokensData.expire)
    // localStorage.setItem(REFRESH_TOKEN_KEY, tokensData.refresh_token);
}

export function setAccessToken(access_token: string) {
    localStorage.setItem(ACCESS_TOKEN_KEY, access_token);
}

export function setAccessTokenExpire(expire: number) {
    localStorage.setItem(EXPIRE_TOKEN_KEY, expire.toString());
}

export function getAccessToken(): string {
    const token = localStorage.getItem(ACCESS_TOKEN_KEY)
    return token || ''
}

export function getRefreshToken(): string {
    const token = localStorage.getItem(REFRESH_TOKEN_KEY)
    return token || ''
}

export function getAccessTokenExpire(): Date | undefined {
    const expire_date = localStorage.getItem(EXPIRE_TOKEN_KEY)
    return expire_date ? new Date(expire_date) : undefined
}

export function clearTokens() {
    setTokenData({
        token: '',
        expire: 0,
    })
}
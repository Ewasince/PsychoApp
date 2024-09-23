import {IAuthResponse} from "../../api/endpoints/apiAuth";
import dayjs from "dayjs";

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

export function isAccessTokenExpired(): boolean {
    const expire_date_string = localStorage.getItem(EXPIRE_TOKEN_KEY)
    const expire_date = expire_date_string ? dayjs(expire_date_string) : dayjs(0)
    return expire_date.isBefore(dayjs())
}

export function clearTokens() {
    setTokenData({
        token: '',
        expire: 0,
    })
}
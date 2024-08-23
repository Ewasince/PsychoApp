import {clearTokens, getRefreshToken, saveAccessToken} from "../core/storage/tokens";
import {handleError} from "../core/errors";
import {getMe, IAuthResponse, REFRESH_URL} from "./endpoints/apiAuth";
import {makePost} from "./apiCore";
import {clearConfig, getConfig, IConfig, setConfig} from "../core/storage/config";

export enum EnumRole {
    student = "STUDENT",
    tutor = "TUTOR",
}


export const refresh = makePost<null, IAuthResponse>(REFRESH_URL, false, true)


export function setUser() {
    return getMe()
        .then(res => {
            // if (!res) {
            //     return
            // }
            const meResponse = res.data;
            const appConfig: IConfig = {
                // accessRights: {
                //     isTutor: meResponse.role === EnumRole.tutor,
                //     isStudent: meResponse.role === EnumRole.student,
                // },
                userId: meResponse.id,
            }
            setConfig(appConfig)
        })
        .catch(error => {
            handleError(error)
        })
}

export function isUserEntered() {
    return !!getConfig().userId;
}

export function exitUser() {
    clearTokens()
    clearConfig()
}

export function refreshToken (callback: (code: any) => void) {
    refresh()
        .then(res => {
            // if (!res) {
            //     return
            // }
            const keys: IAuthResponse = res.data;
            saveAccessToken(keys.access_token);
            setUser();
            callback(200);
        })
        .catch(error => {
            handleError(error)
            callback(error.response.status)
        })
}
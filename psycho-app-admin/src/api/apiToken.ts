import {saveAccessToken} from "../core/storage/tokens";
import {logError} from "../core/errors";
import {getMe, IAuthResponse, REFRESH_URL} from "./endpoints/apiAuth";
import {makePost} from "./apiCore";
import {IConfig, setConfig} from "../core/storage/config";

export enum EnumRole {
    student = "STUDENT",
    tutor = "TUTOR",
}


export const refresh = makePost<null, IAuthResponse>(REFRESH_URL, false, true)


export function setMyRole() {
    return getMe()
        .then(res => {
            // if (!res) {
            //     return
            // }
            const meResponse = res.data;
            const appConfig: IConfig = {
                accessRights: {
                    isTutor: meResponse.role === EnumRole.tutor,
                    isStudent: meResponse.role === EnumRole.student,
                },
                userId: meResponse.id,
            }
            setConfig(appConfig)
        })
        .catch(error => {
            logError(error)
        })
}

export const refreshToken = (callback: (code: any) => void) => {
    refresh()
        .then(res => {
            // if (!res) {
            //     return
            // }
            const keys: IAuthResponse = res.data;
            saveAccessToken(keys.access_token);
            setMyRole();
            callback(200);
        })
        .catch(error => {
            logError(error)
            if (error.response.status === 401) {
                callback(401);
            }
        })
}
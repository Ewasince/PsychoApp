import {clearConfig, getConfig, IConfig, setConfig} from "../core/storage/config";
import {clearTokens} from "../core/storage/tokens";
import {getMe} from "./endpoints/apiAuth";
import {handleError} from "../core/errors";

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
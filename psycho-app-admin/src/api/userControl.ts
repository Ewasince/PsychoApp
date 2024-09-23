import {clearConfig, clearGlobalUser, getGlobalUser, setConfig, setGlobalUser} from "../core/storage/config";
import {clearTokens} from "../core/storage/tokens";
import {getMe} from "./endpoints/apiAuth";
import {handleError} from "../core/errors";

export async function setUser() {
    try {
        const res = await getMe();
        const meResponse = res.data;
        setConfig(meResponse.config);
        setGlobalUser(meResponse.user);
    } catch (error) {
        handleError(error);
    }
}

export function isUserEntered() {
    return !!getGlobalUser();
}

export function exitUser() {
    clearTokens()
    clearConfig()
    clearGlobalUser()
}
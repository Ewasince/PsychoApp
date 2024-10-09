import {clearTokens, setTokenData} from "../../core/storage/tokens";
import {clearConfig, clearGlobalUser, getGlobalUser, setGlobalUser} from "../../core/storage/config";
import {handleError} from "../../core/errors";
import {postRefresh} from "../endpoints/apiAuth";
import {getMe} from "../endpoints/apiUser";


export const refreshToken = async () => {
    const res = await postRefresh()
    const tokenData = res.data;
    setTokenData(tokenData)
    await setUser();
}

export const setUser = async () => {
    try {
        const res = await getMe();
        setGlobalUser(res.data.user);
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
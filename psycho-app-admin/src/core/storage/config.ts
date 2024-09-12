import {IConfig, IMe} from "../../api/endpoints/apiAuth";

let CONFIG_KEY = "config"
let USER_KEY = "user"

let EMPTY_CONFIG: IConfig = {
    // accessRights: {},
    // userId: ''
    is_dev: false,
}

export function setConfig(config: IConfig) {
    console.log(CONFIG_KEY, config)
    localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
}
export function getConfig(): IConfig {
    const config = localStorage.getItem(CONFIG_KEY);
    return config ? JSON.parse(config) : EMPTY_CONFIG
}
export function clearConfig() {
    setConfig(EMPTY_CONFIG)
}

export function setGlobalUser(user: IMe) {
    console.log(USER_KEY, user)
    localStorage.setItem(USER_KEY, JSON.stringify(user));
}
export function getGlobalUser(): IMe | undefined {
    const config = localStorage.getItem(CONFIG_KEY);
    return config ? JSON.parse(config) : undefined
}
export function clearGlobalUser() {
    localStorage.setItem(USER_KEY, "");
}
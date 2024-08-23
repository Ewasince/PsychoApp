export type IConfig = {
    // accessRights: {
    //     isTutor?: boolean,
    //     isStudent?: boolean,
    // },
    userId: string,
}

let EMPTY_CONFIG: IConfig = {
    // accessRights: {},
    userId: ''
}

export function setConfig(config: IConfig) {
    console.log("config", config)
    localStorage.setItem("config", JSON.stringify(config));
}

export function getConfig(): IConfig {
    const config = localStorage.getItem("config");
    return config ? JSON.parse(config) : EMPTY_CONFIG
}

export function clearConfig() {
    setConfig(EMPTY_CONFIG)
}
import {setAccessToken} from "../core/storage/tokens";
import {handleError} from "../core/errors";
import {IAuthResponse, postRefresh} from "./endpoints/apiAuth";
import {setUser} from "./userControl";

export function refreshToken(callback: (code: any) => void) {
    postRefresh()
        .then(res => {
            // if (!res) {
            //     return
            // }
            const tokenData: IAuthResponse = res.data;
            setAccessToken(tokenData.token);
            setUser();
            callback(200);
        })
        .catch(error => {
            handleError(error)
            callback(error.response.status)
        })
}
// import {refreshToken} from "../api/apiToken";
import {NavigateFunction} from "react-router-dom";
import {refreshToken} from "../api/apiRefreshToken";
import {getRefreshToken} from "./storage/tokens";
import {isUserEntered} from "../api/userControl";
import {toast} from "react-toastify";

let LOCATION_WHEN_NOT_VALID_TOKEN = "/login"

export function handleError(error: any, navigate?: NavigateFunction) {
    function logErrorToConsole() {
        console.log(
            "Error: data: ", error.response.data,
            "status: ", error.response.status,
            "headers: ", error.response.headers,
            );
    }

    if (error.response) {
        if (!navigate) {
            logErrorToConsole()
            errorToast(error)
            return
        }
        if (error.response.status === 401) {
            if (!isUserEntered()){
                goToAuthUser(navigate)
            }
            if (!getRefreshToken()){
                goToAuthUser(navigate)
            }

            refreshToken((err) => {
                if (err === 200) {
                    window.location.reload();
                }
                logErrorToConsole()
                if (err === 401) {
                    goToAuthUser(navigate)
                }
            })
            return
        }
        if (error.response.status !== 403) {
            logErrorToConsole()
            errorToast(error)
            return
        }
    } else if (error.request) {
        errorToast(error)
        console.log(error.request);
    } else {
        errorToast(error)
        console.log('Error', error.message);
    }
}

export function goToAuthUser(navigate: NavigateFunction) {
    console.log("goToAuthUser")
    navigate(LOCATION_WHEN_NOT_VALID_TOKEN)
}

function errorToast(error: any) {
    toast.error("Невозможно выполнить запрос: " + error.message)
}





// export function handleError(error: any, navigate?: any, refresh = true) {
//
//     function logErrorInner() {
//         console.log(error.response.data);
//         console.log(error.response.status);
//         console.log(error.response.headers);
//     }
//
//     // return
//     if (error.response) {
//
//         if (!navigate) {
//             logErrorInner()
//             return
//         }
//         if (error.response.status == 401) {
//             navigate('/')
//             logErrorInner()
//             return
//         }
//         if (error.response.status != 403) {
//             logErrorInner()
//             return
//         }
//         if (!refresh) {
//             logErrorInner()
//             return
//         }
//
//         refreshToken((err) => {
//             if (err === 401) {
//                 console.log("handleError refreshToken err === 401")
//                 logErrorInner()
//                 navigate('/')
//                 return
//             }
//             window.location.reload();
//         })
//     } else if (error.request) {
//         console.log(error.request);
//     } else {
//         console.log('Error', error.message);
//     }
//     // console.log(error.config);
// }
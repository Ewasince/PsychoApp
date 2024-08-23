// import {refreshToken} from "../api/apiToken";
import {NavigateFunction} from "react-router-dom";

export function logError(error: any, navigate?: NavigateFunction) {

    function logErrorInner() {
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
    }

    // return
    if (error.response) {

        if (!navigate) {
            logErrorInner()
            return
        }
        if (error.response.status === 401) {
            navigate('/')
            logErrorInner()
            return
        }
        if (error.response.status !== 403) {
            logErrorInner()
            return
        }
    } else if (error.request) {
        console.log(error.request);
    } else {
        console.log('Error', error.message);
    }
    // console.log(error.config);
}


// export function logError(error: any, navigate?: any, refresh = true) {
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
//                 console.log("logError refreshToken err === 401")
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
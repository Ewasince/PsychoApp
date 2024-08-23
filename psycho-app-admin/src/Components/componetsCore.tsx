import {Flip, ToastContainer} from "react-toastify";
import React from "react";


export function getToastContainer() {
    return (
        <ToastContainer
            position="bottom-center"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            // pauseOnFocusLoss
            // draggable
            // pauseOnHover
            theme="light"
            transition={Flip}
        />
    )
}
import {Flip, ToastContainer} from "react-toastify";
import React from "react";
import {Link} from "react-router-dom";


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


export function generateHeading(heading?: string, backButton?: any) {
    return (
        <>
            <div style={{display: "flex", justifyContent: "space-between", alignItems: "flex-end"}}>
                <p className="text-xl sm:text-2xl mb-6 font-medium">{heading}</p>
                {backButton ? backButton : ''}
            </div>
        </>
    )
}

export function generateBackButton(link: string, caption?: string, onClick?: any) {
    caption ??= "Назад"
    return (
        <Link className="text-lg sm:text-xl mb-6 font-normal hover:underline text-gray-300" to={link}
              onClick={onClick}>{caption}</Link>
    )
}

export function forbidden() {
    return (
        <>
            {generateHeading("Forbidden")}
        </>
    )
}
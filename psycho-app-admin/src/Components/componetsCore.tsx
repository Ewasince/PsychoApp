import {Flip, ToastContainer} from "react-toastify";
import React from "react";
import {Link} from "react-router-dom";


export const PredeclaredToastContainer = () => {
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


export function Heading({heading, backButton}: { heading: string, backButton?: any }) {
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
        <Link className="text-lg sm:text-xl mb-6 font-normal hover:underline text-gray-700" to={link}
              onClick={onClick}>{caption}</Link>
    )
}

export function Forbidden() {
    return (
        <>
            <Heading
                heading="Forbidden"
            />
        </>
    )
}

export function Page404() {
    return (
        <>
            <div className="flex flex-col w-full h-full items-center justify-center">
                <p>Такой страницы не существует!</p>
                <a className="font-bold text-3xl"
                   href="/">Вернуться на главную</a>
            </div>
        </>

    )
}
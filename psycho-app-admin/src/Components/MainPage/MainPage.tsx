import * as React from 'react';
import {useEffect, useState} from 'react';
import {Link, Outlet, useLocation, useNavigate} from "react-router-dom";

// import account from "../../images/account.png"
import account from "../../images/account.png"

// import {clearTokens} from "../../core/storage/tokens";
// import {clearConfig, getConfig} from "../../core/storage/config";
// import {getMe} from "../../api/endpoints/apiAuth";
import {goToAuthUser, handleError} from "../../core/errors";
import {isUserEntered, exitUser} from "../../api/apiToken";

export const MainPage = () => {
    const [currentPage, setCurrentPage] = useState<string>("/dashboard")
    const location = useLocation();
    const navigate = useNavigate();
    // const config = getConfig();

    useEffect(() => {
        setCurrentPage(location.pathname);
    }, [location]);
    // useEffect(() => {
    //     if (!isUserEntered()){
    //         goToAuthUser(navigate)
    //         return
    //     }
    //
    //     // getMe()
    //     //     .then(() => {
    //     //
    //     //     })
    //     //     .catch(e => {
    //     //         handleError(e, navigate);
    //     //     })
    // }, []);

    if (!isUserEntered()){
        goToAuthUser(navigate)
        return
    }


    function getMenuElement(path: string, title: string){
        return (<>
            <Link
                className={`px-2 sm:px-4 py-2 w-full ${currentPage === path ? "bg-blue-color" : 'opacity-70'} rounded-lg flex gap-3 items-center`}
                to={path}>
                <img src={account} alt={title} className="w-[15px] sm:w-[19px]"/> <p
                className="hidden sm:block">{title}</p>
            </Link>
        </>)
    }

    function getExitElement(){
        return (
            <a
                className="px-2 sm:px-4 py-2 w-full opacity-70 rounded-lg flex gap-3 items-center"
                href="/"
                onClick={exitUser}
            >
                <img src={account} alt="settings" className="w-[15px] sm:w-[19px]"/>
                <p className="hidden sm:block">Выйти</p>
            </a>
        )
    }

    return (
        <div className="w-full min-h-full h-fit bg-primary-color text-font-color flex justify-between items-stretch">
            <div className="min-w-[50px] sm:min-w-[200px] bg-secondary-color flex flex-col px-2 sm:px-4 items-center">
                <div className="flex flex-col mt-12">
                    <p className="text-xl mb-6 hidden sm:block">Меню</p>
                    <div className="flex flex-col gap-4">
                        {getMenuElement("/dashboard", "Мои курсы")}
                        {getMenuElement("/account", "Профиль")}
                    </div>
                </div>
                <div className="flex flex-col mt-12">
                    <p className="text-xl mb-6 hidden sm:block">Помощь</p>
                    <div className="flex flex-col gap-4">
                        {getMenuElement("/help", "Поддержка")}
                        {getMenuElement("/settings", "Настройки")}
                        {getExitElement()}
                    </div>
                </div>
            </div>
            <div className="w-full min-h-full p-4 md:p-6 xl:p-8">
                <Outlet/>
            </div>
        </div>
    );
};
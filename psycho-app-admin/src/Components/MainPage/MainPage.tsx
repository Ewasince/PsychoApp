import * as React from 'react';
import {useEffect, useState} from 'react';
import {Link, Outlet, useLocation, useNavigate} from "react-router-dom";

// import account from "../../images/account.png"
import account from "../../images/account.png"

// import {clearTokens} from "../../core/storage/tokens";
// import {clearConfig, getConfig} from "../../core/storage/config";
// import {getMe} from "../../api/endpoints/apiAuth";
import {goToAuthUser} from "../../core/errors";

import {exitUser, isUserEntered} from "../../api/userControl";
import {PredeclaredToastContainer} from "../componetsCore";
import {IS_DEV} from "../../core/env";

const DEFAULT_PATH = "/dashboard"

export const MainPage = () => {
    const [currentPage, setCurrentPage] = useState<string>(DEFAULT_PATH)
    const location = useLocation();
    const navigate = useNavigate();
    // const config = getConfig();

    useEffect(() => {
        if (!isUserEntered()) {
            goToAuthUser(navigate)
            return
        }
        setCurrentPage(location.pathname);
        if (location.pathname === "/"){
            navigate(DEFAULT_PATH)
        }
    }, [location]);

    const MenuElement = ({path, title}: { path: string, title: string }) => {
        return (<>
            <Link
                className={`px-2 sm:px-4 py-2 w-full ${currentPage === path ? "bg-blue-color" : 'opacity-70'} rounded-lg flex gap-3 items-center`}
                to={path}>
                <img src={account} alt={title} className="w-[15px] sm:w-[19px]"/> <p
                className="hidden sm:block">{title}</p>
            </Link>
        </>)
    }

    const ExitElement = () => {
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
            <div className="min-w-[50px] sm:min-w-[200px] bg-secondary-color flex flex-col px-2 sm:px-4 items-start">
                <div className="flex flex-col mt-12 ml-2">
                    <p className="text-xl mb-6 hidden sm:block">Меню</p>
                    <div className="flex flex-col gap-4">
                        <MenuElement
                            path="/dashboard"
                            title="Главная"
                        />
                        <MenuElement
                            path="/account"
                            title="Профиль"
                        />
                        {IS_DEV && <MenuElement
                            path="/test_page"
                            title="Тест Апи"
                        />}
                    </div>
                </div>
                <div className="flex flex-col mt-12 ml-2">
                    <p className="text-xl mb-6 hidden sm:block">Помощь</p>
                    <div className="flex flex-col gap-4">
                        {/*{getMenuElement("/help", "Поддержка")}*/}
                        {/*{getMenuElement("/settings", "Настройки")}*/}
                        <ExitElement/>
                    </div>
                </div>
            </div>
            <div className="w-full min-h-full p-4 md:p-6 xl:p-8">
                <Outlet/>
            </div>
            <PredeclaredToastContainer/>
        </div>
    );
};
import * as React from 'react';
import {useEffect, useState} from 'react';
import {Link, Outlet, useLocation, useNavigate} from "react-router-dom";
import {goToAuthUser} from "../../core/errors";

import {exitUser, isUserEntered} from "../../api/userControl";
import {PredeclaredToastContainer} from "../componetsCore";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import DashboardIcon from '@mui/icons-material/Dashboard';
import BugReportIcon from '@mui/icons-material/BugReport';
import {getConfig} from "../../core/storage/config";

const DEFAULT_PATH = "/dashboard"

export const MainPage = () => {
    const [currentPage, setCurrentPage] = useState<string>(DEFAULT_PATH)
    const location = useLocation();
    const navigate = useNavigate();
    // const config = getConfig();

    useEffect(() => {
        if (!isUserEntered()) {
            exitUser()
            goToAuthUser(navigate)
            return
        }
        setCurrentPage(location.pathname);
        if (location.pathname === "/") {
            navigate(DEFAULT_PATH)
        }
    }, [location]);

    const MenuElement = ({path, title, Icon}: {
        path: string,
        title: string,
        Icon: any
    }) => {
        return (<>
            <Link
                className={`
                    px-2 
                    sm:px-4 
                    py-2 
                    w-full 
                    rounded-lg 
                    flex 
                    gap-3 
                    items-center
                    ${currentPage === path ? "bg-blue-color" : 'opacity-70'} 
                `}
                to={path}
            >
                <Icon/>
                <p className="hidden sm:block">{title}</p>
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
                <ExitToAppIcon/>
                <p className="hidden sm:block">Выйти</p>
            </a>
        )
    }

    return (
        <div className="w-full min-h-full h-fit bg-secondary-color text-font-color flex justify-between items-stretch">
            <div className="min-w-[50px] sm:min-w-[200px] bg-primary-color flex flex-col px-2 sm:px-4 items-start flex flex-row justify-between">
                <div className="flex flex-col mt-12 ml-2">
                    <p className="text-xl mb-6 hidden sm:block">Меню</p>
                    <div className="flex flex-col gap-4">
                        <MenuElement
                            path="/dashboard"
                            title="Главная"
                            Icon={DashboardIcon}
                        />
                        <MenuElement
                            path="/account"
                            title="Профиль"
                            Icon={AccountBoxIcon}
                        />
                        {getConfig().is_dev && <MenuElement
                            path="/test_page"
                            title="Тест Апи"
                            Icon={BugReportIcon}
                        />}
                    </div>
                </div>
                <div className="flex flex-col mt-12 ml-2 mb-6">
                    <p className="text-xl mb-6 hidden sm:block"></p>
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
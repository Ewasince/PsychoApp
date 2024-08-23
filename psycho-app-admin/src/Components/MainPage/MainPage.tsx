import * as React from 'react';
import {useEffect, useState} from 'react';
import {Link, useLocation} from "react-router-dom";

// import account from "../../images/account.png"
import account from "../../images/account.png"


// import board from "../../images/board.png"
// import help from "../../images/help.png"
// import settings from "../../images/settings.png"

// import {Dashboard} from "../Dashboard/Dashboard";
// import {Account} from "../Account/Account";
// import {Course} from "../Course/Course";
// import {Module} from "../Module/Module";
// import {Answers} from "../Module/Answers/Answers";
// import {DashboardTutor} from "../DashboardTutor/DashboardTutor";
// import {CourseTutorEdit} from "../CourseTutor/CourseTutorEdit";
// import {ModuleTutor} from "../ModuleTutor/ModuleTutor";
// import {CourseTutorAdd} from "../CourseTutor/CourseTutorAdd/CourseTutorAdd";
// import {ModuleTutorAdd} from "../ModuleTutor/ModuleTutorAdd/ModuleTutorAdd";
// import {CourseTutorStudentsAdd} from "../CourseTutor/CourseTutorStudentsAdd/CourseTutorStudentsAdd";
// import {CourseTutorStudents} from "../CourseTutor/CourseTutorStudents/CourseTutorStudents";
import {clearTokens} from "../../core/storage/tokens";
import {clearConfig, getConfig} from "../../core/storage/config";
// import {CourseTutorStudentsMark} from "../CourseTutor/CourseTutorStudentsMarks/CourseTutorStudentsMark";
// import {CourseTutorStudentsEvents} from "../CourseTutor/CourseTutorStudentsEvents/CourseTutorStudentsEvents";
// const account = require("../../images/account.png");

export const MainPage = () => {
    const [currentPage, setCurrentPage] = useState<string>("/dashboard")
    const location = useLocation();
    const config = getConfig();

    useEffect(() => {
        setCurrentPage(location.pathname);
    }, [location]);

    function getCurrentPage() {
        // console.log("currentPage", currentPage)
        // if (currentPage === "/dashboard_tutor") return <DashboardTutor/>
        // if (currentPage === "/dashboard") return <Dashboard/>
        // if (currentPage === "/account") return <Account/>
        // if (currentPage.startsWith("/course_tutor")) {
        //     console.log("currentPage /course_tutor")
        //     if (currentPage.endsWith("marks")) return <CourseTutorStudentsMark/>
        //     console.log("currentPage not /marks")
        //     if (currentPage.endsWith("events")) return <CourseTutorStudentsEvents/>
        //     console.log("currentPage not /events")
        //     if (currentPage.endsWith("/students/add")) return <CourseTutorStudentsAdd/>
        //     if (currentPage.endsWith("/students")) return <CourseTutorStudents/>
        //     console.log("currentPage not /students")
        //     if (currentPage.endsWith("/add")) return <CourseTutorAdd/>
        //     console.log("currentPage /edit")
        //     if (currentPage.endsWith("/edit")) return <CourseTutorEdit/>
        //     console.log("currentPage not /edit")
        //     return <CourseTutorEdit/>
        // }
        // if (currentPage.startsWith("/course")) return <Course/>
        // if (currentPage.startsWith("/module_tutor")) {
        //     if (currentPage.endsWith("add")) return <ModuleTutorAdd/>
        //     return <ModuleTutor/>
        // }
        // if (currentPage.startsWith("/module")) {
        //     if (currentPage.endsWith("answers")) return <Answers/>
        //     return <Module/>
        // }
        // if (currentPage.startsWith("/dashboard_tutor")) return <DashboardTutor/>
        return ''
    }


    return (
        <div className="w-full min-h-full h-fit bg-primary-color text-font-color flex justify-between items-stretch">
            <div className="min-w-[50px] sm:min-w-[200px] bg-secondary-color flex flex-col px-2 sm:px-4 items-center">
                <div className="flex flex-col mt-12">
                    <p className="text-xl mb-6 hidden sm:block">Меню</p>
                    <div className="flex flex-col gap-4">
                        {config.accessRights.isStudent ?
                            <Link
                                className={`px-2 sm:px-4 py-2 w-full ${currentPage === "/dashboard" ? "bg-blue-color" : 'opacity-70'} rounded-lg flex gap-3 items-center`}
                                to={"/dashboard"}>
                                <img src={account} alt="dashboard" className="w-[15px] sm:w-[19px]"/> <p
                                className="hidden sm:block">Мои курсы</p>
                            </Link> : ''
                        }
                        {config.accessRights.isTutor ?
                            <Link
                                className={`px-2 sm:px-4 py-2 w-full ${currentPage === "/dashboard_tutor" ? "bg-blue-color" : 'opacity-70'} rounded-lg flex gap-3 items-center`}
                                to={"/dashboard_tutor"}>
                                <img src={account} alt="dashboard" className="w-[15px] sm:w-[19px]"/> <p
                                className="hidden sm:block">Мои курсы (автор)</p>
                            </Link> : ''
                        }
                        <Link
                            className={`px-2 sm:px-4 py-2 w-full ${currentPage === "/account" ? "bg-blue-color" : 'opacity-70'} rounded-lg flex gap-3 items-center`}
                            to={"/account"}>
                            <img src={account} alt="Account" className="w-[15px] sm:w-[19px]"/> <p
                            className="hidden sm:block">Профиль</p>
                        </Link>
                    </div>
                </div>
                <div className="flex flex-col mt-12">
                    <p className="text-xl mb-6 hidden sm:block">Помощь</p>
                    <div className="flex flex-col gap-4">
                        <Link
                            className={`px-2 sm:px-4 py-2 w-full ${currentPage === "/help" ? "bg-blue-color" : 'opacity-70'} rounded-lg flex gap-3 items-center`}
                            to={"/help"}>
                            <img src={account} alt="help" className="w-[15px] sm:w-[19px]"/> <p
                            className="hidden sm:block">Поддержка</p>
                        </Link>
                        <Link
                            className={`px-2 sm:px-4 py-2 w-full ${currentPage === "/settings" ? "bg-blue-color" : 'opacity-70'} rounded-lg flex gap-3 items-center`}
                            to={"/settings"}>
                            <img src={account} alt="settings" className="w-[15px] sm:w-[19px]"/> <p
                            className="hidden sm:block">Настройки</p>
                        </Link>
                        <a
                            className="px-2 sm:px-4 py-2 w-full opacity-70 rounded-lg flex gap-3 items-center"
                            href="/"
                            onClick={(e) => {
                                clearTokens()
                                clearConfig()
                            }}
                        >
                            <img src={account} alt="settings" className="w-[15px] sm:w-[19px]"/> <p
                            className="hidden sm:block">Выйти</p>
                        </a>

                    </div>
                </div>
            </div>
            <div className="w-full min-h-full p-4 md:p-6 xl:p-8">
                {getCurrentPage()}
                {/*<ToastContainer className="h-10 w-10"/>*/}
            </div>
        </div>
    );
};
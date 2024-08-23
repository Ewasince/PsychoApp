import React from 'react';
import ReactDOM from 'react-dom/client';
import 'react-toastify/dist/ReactToastify.css';
import './index.css';
import {Login} from './Components/Login/Login';
import {createBrowserRouter, RouterProvider,} from "react-router-dom";
import {MainPage} from "./Components/MainPage/MainPage";
import {Dashboard} from "./Components/MainPage/Dashboard/Dashboard";

function page404() {
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

const router = createBrowserRouter([
    {
        path: "/login",
        element: <Login/>,
        errorElement: page404(),
    },
    {
        path: "/",
        element: <MainPage/>,
        errorElement: page404(),
        children: [
            {
                path: "dashboard",
                element: <Dashboard/>
            }
        ]
    },
    // ...[
    //     "dashboard",
    //     "dashboard_tutor",
    //     "course_tutor/add",
    //     "course_tutor/:courseId/edit",
    //     "course_tutor/:courseId/students",
    //     "course_tutor/:courseId/students/:studentId/marks",
    //     "course_tutor/:courseId/students/:studentId/events",
    //     "course_tutor/:courseId/students/add",
    //
    //     "module_tutor/:courseId/add",
    //     "module_tutor/:moduleId",
    //     "module_tutor/:moduleId/answers",
    //
    //     "help",
    //     "account",
    //     "settings",
    //     "course/:courseId",
    //     "module/:moduleId",
    //     "module/:moduleId/answers",
    // ].map((path: string) => {
    //     return {
    //         path: path,
    //         element: <MainPage/>,
    //     }
    // }),
]);

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
root.render(
    <RouterProvider router={router}/>
    // <React.StrictMode>
    // </React.StrictMode>
);

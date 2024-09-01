import React from 'react';
import ReactDOM from 'react-dom/client';
import 'react-toastify/dist/ReactToastify.css';
import './index.css';
import {Login} from './Components/Login/Login';
import {createBrowserRouter, RouterProvider,} from "react-router-dom";
import {MainPage} from "./Components/MainPage/MainPage";
import {Dashboard} from "./Components/MainPage/Dashboard/Dashboard";
import {TestPage} from "./Components/MainPage/TestPage/TestPage";
import {PatientBoard} from "./Components/MainPage/PatientBoard/PatientBoard";
import {Page404} from "./Components/componetsCore";
import {Account} from "./Components/MainPage/Account/Account";

const router = createBrowserRouter([
    {
        path: "/login",
        element: <Login/>,
        errorElement: Page404(),
    },
    {
        path: "/",
        element: <MainPage/>,
        errorElement: Page404(),
        children: [
            {
                path: "dashboard",
                element: <Dashboard/>
            },
            {
                path: "patient/:patientId",
                element: <PatientBoard/>
            },
            {
                path: "test_page",
                element: <TestPage/>
            },
            {
                path: "account",
                element: <Account/>
            },
        ]
    },
]);

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
root.render(
    <RouterProvider router={router}/>
    // <React.StrictMode>
    // </React.StrictMode>
);

// import * as React from 'react';
// import {useEffect, useState} from 'react';
// import {Link, Outlet, useLocation, useNavigate} from "react-router-dom";
//
// // import account from "../../images/account.png"
// import account from "../../images/account.png"
//
// // import {clearTokens} from "../../core/storage/tokens";
// // import {clearConfig, getConfig} from "../../core/storage/config";
// // import {getMe} from "../../api/endpoints/apiAuth";
// import {goToAuthUser, handleError} from "../../core/errors";
// import {isUserEntered, exitUser} from "../../api/apiToken";

import {toast} from "react-toastify";
import account from "../../../images/account.png";
import * as React from "react";
import {setUser} from "../../../api/userControl";
import {getPatients} from "../../../api/endpoints/apiPatients";

export const Dashboard = () => {
    // const [currentPage, setCurrentPage] = useState<string>("/dashboard")
    // const location = useLocation();
    // const navigate = useNavigate();
    // const config = getConfig();

    // useEffect(() => {
    //     setCurrentPage(location.pathname);
    // }, [location]);

    return <>
        <p>Hello, World!</p>

        <button
            className={`px-2 sm:px-4 py-2 w-full ${"opacity-70"} rounded-lg flex gap-3 items-center`}
            onClick={() => {
                console.log("tests")
                setUser()
                    .then(() => {
                        toast.info("user was set")
                    })

            }}
        >
            <img src={account} alt={"test"} className="w-[15px] sm:w-[19px]"/>
            <p className="hidden sm:block">{"test"}</p>
        </button>

        <button
            className={`px-2 sm:px-4 py-2 w-full ${"opacity-70"} rounded-lg flex gap-3 items-center`}
            onClick={() => {
                getPatients()
                    .then(res => {
                        let patients = res.data
                        console.log(patients)
                        toast.info("patients were received")
                    })
                    .catch(err => {
                        toast.error("patients weren't received ((")
                    })
            }}
        >
            <img src={account} alt={"test"} className="w-[15px] sm:w-[19px]"/>
            <p className="hidden sm:block">Patients</p>
        </button>

    </>
};
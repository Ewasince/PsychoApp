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
import {getPatient, getPatients, getPatientStories} from "../../../api/endpoints/apiPatients";

export const TestPage = () => {
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

        <button
            className={`px-2 sm:px-4 py-2 w-full ${"opacity-70"} rounded-lg flex gap-3 items-center`}
            onClick={() => {
                getPatient({}, "20")
                    .then(res => {
                        let patient = res.data
                        console.log(patient)
                        toast.info("patient were received")
                    })
                    .catch(err => {
                        toast.error("patient weren't received ((")
                    })
            }}
        >
            <img src={account} alt={"test"} className="w-[15px] sm:w-[19px]"/>
            <p className="hidden sm:block">Current Patient</p>
        </button>

        <button
            className={`px-2 sm:px-4 py-2 w-full ${"opacity-70"} rounded-lg flex gap-3 items-center`}
            onClick={() => {
                const date = new Date();
                const todayStr = date.toISOString()
                date.setDate(date.getDate() - 2)
                const twoDaysAgoStr = date.toISOString()
                console.log(todayStr)
                getPatientStories({
                    params: {
                        dateStart: todayStr,
                        dateFinish: twoDaysAgoStr,
                    }
                }, "20", "story")
                    .then(res => {
                        let stories = res.data
                        console.log(stories)
                        toast.info("stories were received")
                    })
                    .catch(err => {
                        toast.error("stories weren't received ((")
                    })
            }}
        >
            <img src={account} alt={"test"} className="w-[15px] sm:w-[19px]"/>
            <p className="hidden sm:block">Patient stories</p>
        </button>

    </>
};
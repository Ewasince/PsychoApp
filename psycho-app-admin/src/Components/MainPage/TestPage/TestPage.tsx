import {toast} from "react-toastify";
import account from "../../../images/account.png";
import * as React from "react";
import {getPatient, getPatients, getPatientStories} from "../../../api/endpoints/apiPatients";
import {setUser} from "../../../api/auth/common";

export const TestPage = () => {

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
            onClick={async () => {
                try {
                    const res = await getPatients()
                    let patients = res.data
                    console.log(patients)
                    toast.info("patients were received")
                } catch (error) {
                    toast.error("patients weren't received ((")
                }
            }}
        >
            <img src={account} alt={"test"} className="w-[15px] sm:w-[19px]"/>
            <p className="hidden sm:block">Patients</p>
        </button>

        <button
            className={`px-2 sm:px-4 py-2 w-full ${"opacity-70"} rounded-lg flex gap-3 items-center`}
            onClick={() => {
                getPatient("20")
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
                const todayStr = date.valueOf()
                date.setDate(date.getDate() - 2)
                const twoDaysAgoStr = date.valueOf()
                console.log(todayStr)
                getPatientStories("20", {
                    dateStart: todayStr,
                    dateFinish: twoDaysAgoStr,

                })
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

        <button
            className={`px-2 sm:px-4 py-2 w-full ${"opacity-70"} rounded-lg flex gap-3 items-center`}
            onClick={() => {
                const date = new Date();
                const todayStr = date.toISOString()
                date.setDate(date.getDate() - 2)
                const twoDaysAgoStr = date.toISOString()
                console.log(todayStr)
                getPatientStories("20")
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
            <p className="hidden sm:block">Patient stories empty</p>
        </button>

        {/*<button*/}
        {/*    className={`px-2 sm:px-4 py-2 w-full ${"opacity-70"} rounded-lg flex gap-3 items-center`}*/}
        {/*    onClick={() => {*/}
        {/*        refreshToken()*/}
        {/*    }}*/}
        {/*>*/}
        {/*    <img src={account} alt={"test"} className="w-[15px] sm:w-[19px]"/>*/}
        {/*    <p className="hidden sm:block">RefreshToken</p>*/}
        {/*</button>*/}

    </>
};
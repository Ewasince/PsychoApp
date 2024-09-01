import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {getMe, IMe} from "../../../api/endpoints/apiAuth";
import {handleError} from "../../../core/errors";
import {Heading} from "../../componetsCore";

export const Account = () => {
    const [user, setUser] = useState<IMe>();
    const navigate = useNavigate();

    useEffect(() => {
        getMe()
            .then(res => {
                if (res) {
                    setUser(res.data)
                }
            })
            .catch(err => {
                handleError(err, navigate)
            })
    }, [])

    return (

        <div
            className="w-full bg-secondary-color rounded-lg sm:rounded-xl p-4 sm:p-6 xl:p-8 text-font-color flex flex-col">
            <Heading
                heading="Профиль"
            />

            <div className="container mt-5">
                <div className="entry-container flex flex-col-reverse 2xl:flex-row gap-1 sm:gap-2">
                    <div className="flex flex-col w-full 2xl:max-w-[310px]">
                        <p className="text-lg sm:text-xl flex flex space-x-2">
                            <div className="font-medium">Имя: </div>
                            <div className="mr-2" >{user?.username}</div>
                        </p>
                    </div>
                </div>
            </div>
        </div>
)
}
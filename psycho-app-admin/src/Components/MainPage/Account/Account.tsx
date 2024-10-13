import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {IMe} from "../../../api/endpoints/apiAuth";
import {getGlobalUser} from "../../../core/storage/config";
import {Heading} from "../../componetsCore";

export const Account = () => {
    const [user, setUser] = useState<IMe>();
    const navigate = useNavigate();

    useEffect(() => {
        setUser(getGlobalUser())
    }, []);

    return (

        <div
            className="w-full bg-secondary-color rounded-lg sm:rounded-xl p-4 sm:p-6 xl:p-8 text-font-color flex flex-col">
            <Heading
                heading={`Профиль ${user?.name}`}
            />

            <div className="container mt-5">
                <div className="entry-container flex flex-col-reverse 2xl:flex-row gap-1 sm:gap-2">
                    <div className="w-full 2xl:max-w-[310px] grid grid-cols-2 gap-4 text-lg sm:text-xl space-x-2 ">

                        <div className="font-medium text-right">Ваш никнейм:</div>
                        <div className="mr-2">{user?.username}</div>

                        <div className="font-medium text-right">Ваша почта:</div>
                        <div className="mr-2">{user?.email || "—"}</div>

                    </div>
                </div>
            </div>


            <button onClick={() => {alert("Находится в разработке. Пока пациенты могут свободно добавляться")}}
                    className="text-xl px-6 py-2 bg-blue-color rounded-xl mt-4 sm:mt-6 hover:bg-dark-blue-color"
            >Добавить пациента
            </button>

        </div>
    )
}
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {getMe, IMe} from "../../../api/endpoints/apiAuth";
import {handleError} from "../../../core/errors";

import AccountBoxIcon from '@mui/icons-material/AccountBox';

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
        <div className="bg-secondary-color rounded-lg sm:rounded-xl p-4 sm:p-6 xl:p-8">
            <div className="flex flex-col md:flex-row gap-8 md:items-center">
                <AccountBoxIcon/>
                {/*<img src={AccountBoxIcon} alt="account icon" className="w-28"/>*/}
                <div className="flex flex-col gap-2 sm:gap-4">
                    <p className="text-lg sm:text-xl">Username: {user ? user.username : ''}</p>
                    {/*<p className="text-lg sm:text-xl">Статус: {user ? user. : ''}</p>*/}
                    {/*<p className="text-lg sm:text-xl">Создан: {user ? user.created_at.toString() : ''}</p>*/}
                    {/*<p className="text-lg sm:text-xl">Телефон: {user ? user.created_at : ''}</p>*/}
                    {/*<p className="text-lg sm:text-xl">Имя: {user ? user. : ''}</p>*/}
                    {/*<p className="text-lg sm:text-xl">Фамилия: {user ? user.lastname : ''}</p>*/}
                </div>
            </div>
        </div>
    )
}
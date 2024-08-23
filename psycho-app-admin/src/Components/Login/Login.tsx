import React, {useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";
import {handleError} from "../../core/errors";
import {setTokens} from "../../core/storage/tokens";

import {setUser} from "../../api/apiToken";
import {getMe, IAuthResponse, postLogin, postSingUpStudent, postSingUpTutor} from "../../api/endpoints/apiAuth";

//
// type ILog = {
//     username: string;
//     password: string;
// }


export function Login() {
    const [username, setUsername] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [fio, setFio] = useState<string>('')
    const [phone, setPhone] = useState<string>('')
    const [email, setEmail] = useState<string>('')
    const [firstname, setFirstname] = useState<string>('')
    const [lastname, setLastname] = useState<string>('')
    const [inOut, setInOut] = useState<boolean>(true)
    const [isTutor, setIsTutor] = useState<boolean>(false)
    const [correct, setCorrect] = useState<boolean>(false)
    const navigate = useNavigate();

    useEffect(() => {
        getMe()
            .then(() => {
                navigateToDashboard()
            })
    }, []);


    function navigateToDashboard() {
        navigate("/dashboard")

        // if (getConfig().accessRights.isStudent) {
        //     navigate("/dashboard")
        // } else if (getConfig().accessRights.isTutor) {
        //     navigate("/dashboard_tutor")
        // }
    }

    const onInputLog = (e: any) => {
        if (e.target.id === 'email') {
            setEmail(e.target.value)
        } else if (e.target.id === 'password') {
            setPassword(e.target.value)
        }
    }


    const onSubmitLogin = (e: any) => {
        e.preventDefault();
        postLogin({
            username: email,
            password: password,
        })
            .then(res => {
                // if (!res) {
                //     return
                // }
                const response: IAuthResponse = res.data;
                setTokens(response)
                setUser()
                    .then(navigateToDashboard)
            })
            .catch(err => {
                if (err.response.status === 401) {
                    // wrong login and pass!!!
                    return
                }
                handleError(err, navigate)
            })
    }

    const onSubmitRegister = (e: any) => {
        e.preventDefault();
        const signUp = isTutor ? postSingUpTutor : postSingUpStudent
        signUp({
            username: username,
            password: password,
            fio: fio,
            // email: email,
            // phone: phone,
            // firstname: firstname,
            // lastname: lastname,
            // isTutor: isTutor,
        })
            .catch(err => {
                handleError(err, navigate)
            })
            .then(res => {
                if (!res) {
                    return
                }
                const keys: IAuthResponse = res.data;
                setTokens(keys)
                setUser()

                navigate("/dashboard")
            });
    }

    function getLoginPage() {
        return (
            <div
                className="container mx-auto h-full text-font-color flex flex-col items-center justify-center px-4 sm:p-0">
                <div className="w-full sm:w-[550px] h-fit bg-secondary-color rounded-xl p-4 sm:p-10">
                    <form className="flex flex-col gap-4 sm:gap-6">
                        <p className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-4">Вход</p>
                        <div className="flex flex-col">
                            <label className="text-xl sm:text-2xl mb-3 font-bold" htmlFor="email">Login*</label>
                            <input required id="email" type="email"
                                   value={email}
                                   onChange={onInputLog}
                                   className={`text-xl px-6 py-2 bg-secondary-color ${correct ? "border-red-500" : 'border-blue-color'} border-[3px] rounded-xl focus:outline-none`}
                                   placeholder="email@example.com"/>
                        </div>
                        <div className="flex flex-col">
                            <label className="text-xl sm:text-2xl mb-3 font-bold" htmlFor="password">Пароль*</label>
                            <input required id="password" type="password"
                                   value={password}
                                   onChange={onInputLog}
                                   className={`text-xl px-6 py-2 bg-secondary-color ${correct ? "border-red-500" : 'border-blue-color'} border-[3px] rounded-xl focus:outline-none`}
                                   placeholder="∗∗∗∗∗∗∗∗∗∗∗∗∗"/>
                        </div>
                        <button onClick={onSubmitLogin}
                                className="text-xl px-6 py-2 bg-blue-color rounded-xl mt-4 sm:mt-6">Войти
                        </button>
                    </form>
                    <div
                        className="flex flex-col sm:flex-row sm:gap-8 font-bold items-center sm:justify-center mt-[30px]">
                        <p className="text-lg sm:text-2xl">Нет аккаунта?</p>
                        <p onClick={() => {
                            setInOut(false)
                        }}
                           className="w-fit text-lg sm:text-2xl border-b-[3px] border-blue-color rounded-bl-sm rounded-br-sm text-blue-color">Зарегистрироваться</p>
                    </div>
                </div>
            </div>
        )
    }

    function getRegisterPage() {
        return (<div
            className="container mx-auto h-full text-font-color flex flex-col items-center justify-center px-4 sm:p-0">
            <div className="w-full sm:w-[550px] h-fit bg-secondary-color rounded-xl p-4 sm:p-10">
                <form className="flex flex-col gap-4 sm:gap-6">
                    <p className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-4">Регистрация</p>
                    <div className="flex flex-col">
                        <label className="text-xl sm:text-2xl mb-3 font-bold" htmlFor="username">Username*</label>
                        <input required id="username"
                               type="text"
                               value={username}
                               onChange={e => setUsername(e.target.value)}
                               className="text-xl px-6 py-2 bg-secondary-color border-blue-color border-[3px] rounded-xl focus:outline-none"
                               placeholder="IvanIvanov"/>
                    </div>
                    <div className="flex flex-col">
                        <label className="text-xl sm:text-2xl mb-3 font-bold" htmlFor="fio">Фамилия Имя*</label>
                        <input required id="fio"
                               type="text"
                               value={fio}
                               onChange={e => setFio(e.target.value)}
                               className="text-xl px-6 py-2 bg-secondary-color border-blue-color border-[3px] rounded-xl focus:outline-none"
                               placeholder="IvanIvanov"/>
                    </div>
                    {/*<div className="flex flex-col">*/}
                    {/*    <label className="text-xl sm:text-2xl mb-3 font-bold" htmlFor="email">Email*</label>*/}
                    {/*    <input required id="email"*/}
                    {/*           type="email"*/}
                    {/*           value={email}*/}
                    {/*           onChange={onInput}*/}
                    {/*           className="text-xl px-6 py-2 bg-secondary-color border-blue-color border-[3px] rounded-xl focus:outline-none"*/}
                    {/*           placeholder="email@example.com"/>*/}
                    {/*</div>*/}
                    {/*<div className="flex flex-col">*/}
                    {/*    <label className="text-xl sm:text-2xl mb-3 font-bold" htmlFor="phone">Телефон</label>*/}
                    {/*    <input id="phone"*/}
                    {/*           type="phone"*/}
                    {/*           value={phone}*/}
                    {/*           onChange={onInput}*/}
                    {/*           className="text-xl px-6 py-2 bg-secondary-color border-blue-color border-[3px] rounded-xl focus:outline-none"*/}
                    {/*           placeholder="+7 900-000-00-00"/>*/}
                    {/*</div>*/}
                    {/*<div className="flex flex-col">*/}
                    {/*    <label className="text-xl sm:text-2xl mb-3 font-bold" htmlFor="firstname">Имя</label>*/}
                    {/*    <input id="firstname"*/}
                    {/*           type="text"*/}
                    {/*           value={firstname}*/}
                    {/*           onChange={e => setFirstname(e.target.value)}*/}
                    {/*           className="text-xl px-6 py-2 bg-secondary-color border-blue-color border-[3px] rounded-xl focus:outline-none"*/}
                    {/*           placeholder="Иван"/>*/}
                    {/*</div>*/}
                    {/*<div className="flex flex-col">*/}
                    {/*    <label className="text-xl sm:text-2xl mb-3 font-bold" htmlFor="lastname">Фамилия</label>*/}
                    {/*    <input id="lastname"*/}
                    {/*           type="text"*/}
                    {/*           value={lastname}*/}
                    {/*           onChange={e => setLastname(e.target.value)}*/}
                    {/*           className="text-xl px-6 py-2 bg-secondary-color border-blue-color border-[3px] rounded-xl focus:outline-none"*/}
                    {/*           placeholder="Иванов"/>*/}
                    {/*</div>*/}
                    <div className="flex flex-col">
                        <label className="text-xl sm:text-2xl mb-3 font-bold" htmlFor="password">Пароль*</label>
                        <input required id="password"
                               type="password"
                               value={password}
                               onChange={e => setPassword(e.target.value)}
                               className="text-xl px-6 py-2 bg-secondary-color border-blue-color border-[3px] rounded-xl focus:outline-none"
                               placeholder="∗∗∗∗∗∗∗∗∗∗∗∗∗"/>
                    </div>


                    <label className="flex flex-row justify-center space-x-4 items-center">
                        <div className="text-base sm:text-lg inline-block">Я учитель</div>
                        <input type="checkbox"
                               className="checkbox-container"
                               checked={isTutor}
                               onChange={() => setIsTutor(!isTutor)}/>
                    </label>
                    <button onClick={onSubmitRegister}
                            className="text-xl px-6 py-2 bg-blue-color rounded-xl mt-4 sm:mt-6">Зарегистрироваться
                    </button>
                </form>
                <div
                    className="flex flex-col sm:flex-row sm:gap-8 font-bold items-center sm:justify-center mt-[30px]">
                    <p className="text-lg sm:text-2xl ">Уже есть аккаунт?</p>
                    <p onClick={() => {
                        setInOut(true)
                    }}
                       className="w-fit text-lg sm:text-2xl border-b-[3px] border-blue-color rounded-bl-sm rounded-br-sm text-blue-color">Войти</p>
                </div>
            </div>
        </div>)
    }

    return (
        <div className="w-full h-fit min-h-full py-10 bg-cover bg-background">
            {inOut ? getLoginPage() : getRegisterPage()}
        </div>
    );
}

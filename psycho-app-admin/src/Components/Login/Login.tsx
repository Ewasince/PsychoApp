import React, {useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";
import {handleError} from "../../core/errors";
import {setTokenData} from "../../core/storage/tokens";
import {toast} from "react-toastify";

import {IAuthResponse, postLogin, postSingUp} from "../../api/endpoints/apiAuth";
import {PredeclaredToastContainer} from "../componetsCore"
import {getMe} from "../../api/endpoints/apiUser";
import {setUser} from "../../api/auth/common";
import {HttpStatusCode} from "axios";

//
// type ILog = {
//     username: string;
//     password: string;
// }


export function Login() {
    const [username, setUsername] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [fio, setFio] = useState<string>('')
    const [email, setEmail] = useState<string>('')
    const [isLogin, setIsLogin] = useState<boolean>(true)
    const [correct, setCorrect] = useState<boolean>(false)
    const navigate = useNavigate();

    useEffect(() => {
        getMe()
            .then(res => {
                navigateToDashboard()
            })
            .catch(err => {
            })
    }, []);


    function navigateToDashboard() {
        navigate("/dashboard")
    }

    const onInputLog = (e: any) => {
        if (e.target.id === 'email') {
            setEmail(e.target.value)
        } else if (e.target.id === 'password') {
            setPassword(e.target.value)
        }
    }


    const onSubmitLogin = async (e: any) => {
        e.preventDefault();
        try {
            const res = await postLogin({
                username: username,
                password: password,
            })
            const tokenData: IAuthResponse = res.data;
            setTokenData(tokenData)
            await setUser()
            navigateToDashboard()
        } catch (error: any) {
            if (error?.response?.status === 401) {
                toast.error("Неправильный логин и/или пароль!")
                return
            }
            handleError(error, navigate)
        }
    }

    const onSubmitRegister = async (e: any) => {
        e.preventDefault();
        try {
            await postSingUp({
                username: username,
                password: password,
                name: fio,
                email: email,
            })
            toast.info("Пользователь успешно зарегестрирован! Теперь вы можете войти")
            setUsername("")
            setPassword("")
            setEmail("")
            setFio("")
            setIsLogin(true)
        } catch (error: any) {
            console.log("erroe!")
            if (error?.response.status === HttpStatusCode.BadRequest) {
                console.log("error 1")
                toast.error("Пользователь не зарегистрирован. Возможно у вас отсутствует приглашение")
            } else if (error?.response.status === HttpStatusCode.Conflict) {
                console.log("error 2")
                toast.error("Пользователь с такими данными уже существует!")
            } else {
                console.log("error 3")
                handleError(error)
            }
        }
    }

    function LoginPage() {
        return <div
            className="container mx-auto h-full text-font-color flex flex-col items-center justify-center px-4 sm:p-0">
            <div className="w-full sm:w-[550px] h-fit bg-secondary-color rounded-xl p-4 sm:p-10">
                <form className="flex flex-col gap-4 sm:gap-6">
                    <p className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-4">Вход</p>
                    <div className="flex flex-col">
                        <label className="text-xl sm:text-2xl mb-3 font-medium" htmlFor="username">Логин*</label>
                        <input required id="username" type="username"
                               value={username}
                               onChange={e => setUsername(e.target.value)}
                               className={`
                                   text-xl 
                                   px-6 
                                   py-2 
                                   bg-secondary-color 
                                   border-[3px] 
                                   rounded-xl 
                                   focus:outline-none
                                   ${correct ? "border-red-500" : 'border-blue-color'} 
                               `}
                               placeholder="mycoolnick"/>
                    </div>
                    <div className="flex flex-col">
                        <label className="text-xl sm:text-2xl mb-3 font-medium" htmlFor="password">Пароль*</label>
                        <input required id="password" type="password"
                               value={password}
                               onChange={e => setPassword(e.target.value)}
                               className={`
                                   text-xl 
                                   px-6 
                                   py-2 
                                   bg-secondary-color 
                                   ${correct ? "border-red-500" : 'border-blue-color'} 
                                   border-[3px] 
                                   rounded-xl 
                                   focus:outline-none
                               `}
                               placeholder="∗∗∗∗∗∗∗∗∗∗∗∗∗"/>
                    </div>
                    <button onClick={onSubmitLogin}
                            className="text-xl px-6 py-2 bg-blue-color rounded-xl mt-4 sm:mt-6 hover:bg-dark-blue-color">Войти
                    </button>
                </form>
                <div
                    className="flex flex-col sm:flex-row sm:gap-8 font-bold items-center sm:justify-center mt-[30px]">
                    <p className="text-lg sm:text-2xl">Нет аккаунта?</p>
                    <p onClick={() => setIsLogin(false)}
                       className="
                           w-fit
                           text-lg
                           sm:text-2xl
                           border-b-[3px]
                           border-blue-color
                           rounded-bl-sm
                           rounded-br-sm
                           text-blue-color
                           cursor-pointer
                           hover:text-dark-blue-color
                       ">Зарегистрироваться</p>
                </div>
            </div>
        </div>

    }

    function RegisterPage() {
        return <div
            className="container mx-auto h-full text-font-color flex flex-col items-center justify-center px-4 sm:p-0">
            <div className="w-full sm:w-[550px] h-fit bg-secondary-color rounded-xl p-4 sm:p-10">
                <form className="flex flex-col gap-4 sm:gap-6">
                    <p className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-4">Регистрация</p>
                    <div className="flex flex-col">
                        <label className="text-xl sm:text-2xl mb-3 font-bold" htmlFor="username">Логин*</label>
                        <input required id="username"
                               type="text"
                               value={username}
                               onChange={e => setUsername(e.target.value)}
                               className="text-xl px-6 py-2 bg-secondary-color border-blue-color border-[3px] rounded-xl focus:outline-none"
                               placeholder="ivanuser"/>
                    </div>
                    <div className="flex flex-col">
                        <label className="text-xl sm:text-2xl mb-3 font-bold" htmlFor="fio">Фамилия Имя*</label>
                        <input required id="fio"
                               type="text"
                               value={fio}
                               onChange={e => setFio(e.target.value)}
                               className="text-xl px-6 py-2 bg-secondary-color border-blue-color border-[3px] rounded-xl focus:outline-none"
                               placeholder="Ivan Ivanov"/>
                    </div>
                    <div className="flex flex-col">
                        <label className="text-xl sm:text-2xl mb-3 font-bold" htmlFor="email">Email*</label>
                        <input required id="email"
                               type="text"
                               value={email}
                               onChange={e => setEmail(e.target.value)}
                               className="text-xl px-6 py-2 bg-secondary-color border-blue-color border-[3px] rounded-xl focus:outline-none"
                               placeholder="ivan@example.com"/>
                    </div>
                    <div className="flex flex-col">
                        <label className="text-xl sm:text-2xl mb-3 font-bold" htmlFor="password">Пароль*</label>
                        <input required id="password"
                               type="password"
                               value={password}
                               onChange={e => setPassword(e.target.value)}
                               className="text-xl px-6 py-2 bg-secondary-color border-blue-color border-[3px] rounded-xl focus:outline-none"
                               placeholder="∗∗∗∗∗∗∗∗∗∗∗∗∗"/>
                    </div>
                    <button onClick={onSubmitRegister}
                            className="text-xl px-6 py-2 bg-blue-color rounded-xl mt-4 sm:mt-6 hover:bg-dark-blue-color">Зарегистрироваться
                    </button>
                </form>
                <div
                    className="flex flex-col sm:flex-row sm:gap-8 font-bold items-center sm:justify-center mt-[30px]">
                    <p className="text-lg sm:text-2xl ">Уже есть аккаунт?</p>
                    <p onClick={() => {
                        setIsLogin(true)
                    }}
                       className={`
                           w-fit
                           text-lg
                           sm:text-2xl
                           border-b-[3px] 
                           border-blue-color 
                           rounded-bl-sm
                           rounded-br-sm 
                           text-blue-color
                           cursor-pointer
                           hover:text-dark-blue-color
                        `}>Войти</p>
                </div>
            </div>
        </div>
    }

    return (
        <>
            <div className="w-full h-fit min-h-full py-10 bg-cover bg-background">
                {isLogin ? LoginPage() : RegisterPage()}
                <PredeclaredToastContainer/>
            </div>
        </>
    );
}

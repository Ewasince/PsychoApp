import React, {useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";
import {handleError} from "../../core/errors";
import {setTokenData} from "../../core/storage/tokens";
import {toast} from "react-toastify";

import {IAuthResponse, postLogin, postSingUpStudent, postSingUpTutor} from "../../api/endpoints/apiAuth";
import {PredeclaredToastContainer} from "../componetsCore"
import {getMe} from "../../api/endpoints/apiUser";
import {setUser} from "../../api/auth/common";

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
    const [isLogin, setIsLogin] = useState<boolean>(true)
    const [isTutor, setIsTutor] = useState<boolean>(false)
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
                username: email,
                password: password,
            })
            const tokenData: IAuthResponse = res.data;
            setTokenData(tokenData)
            await setUser()
            navigateToDashboard()
        } catch (error: any) {
            if (error?.response?.status === 401) {
                // wrong login and pass!!!
                toast.error("Неправильный логин и/или пароль!")
                return
            }
            handleError(error, navigate)
        }
    }

    const onSubmitRegister = async (e: any) => {
        e.preventDefault();
        const signUp = isTutor ? postSingUpTutor : postSingUpStudent
        try {
            const res = await signUp({
                username: username,
                password: password,
                fio: fio,
            })

            if (!res) {
                return
            }
            const keys: IAuthResponse = res.data;
            setTokenData(keys)
            await setUser()

            navigate("/dashboard")
        } catch (error) {
            handleError(error, navigate)
        }
    }

    function LoginPage() {
        return <div
            className="container mx-auto h-full text-font-color flex flex-col items-center justify-center px-4 sm:p-0">
            <div className="w-full sm:w-[550px] h-fit bg-secondary-color rounded-xl p-4 sm:p-10">
                <form className="flex flex-col gap-4 sm:gap-6">
                    <p className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-4">Вход</p>
                    <div className="flex flex-col">
                        <label className="text-xl sm:text-2xl mb-3 font-medium" htmlFor="email">Логин*</label>
                        <input required id="email" type="email"
                               value={email}
                               onChange={onInputLog}
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
                               placeholder="email@example.com"/>
                    </div>
                    <div className="flex flex-col">
                        <label className="text-xl sm:text-2xl mb-3 font-medium" htmlFor="password">Пароль*</label>
                        <input required id="password" type="password"
                               value={password}
                               onChange={onInputLog}
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
                {/*<div*/}
                {/*    className="flex flex-col sm:flex-row sm:gap-8 font-bold items-center sm:justify-center mt-[30px]">*/}
                {/*    <p className="text-lg sm:text-2xl">Нет аккаунта?</p>*/}
                {/*    <p onClick={() => setIsLogin(false)}*/}
                {/*       className="w-fit text-lg sm:text-2xl border-b-[3px] border-blue-color rounded-bl-sm rounded-br-sm text-blue-color cursor-pointer hover:text-dark-blue-color">Зарегистрироваться</p>*/}
                {/*</div>*/}
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

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { handleError } from "../../core/errors";
import { setTokenData } from "../../core/storage/tokens";
import { toast } from "react-toastify";

import {
  IAuthResponse,
  postLogin,
  postSingUp,
} from "../../api/endpoints/apiAuth";
import { PredeclaredToastContainer } from "../componetsCore";
import { getMe } from "../../api/endpoints/apiUser";
import { setUser } from "../../api/auth/common";
import { HttpStatusCode } from "axios";

//
// type ILog = {
//     username: string;
//     password: string;
// }

export function Login() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [fio, setFio] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [correct, setCorrect] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    getMe()
      .then((res) => {
        navigateToDashboard();
      })
      .catch((err) => {});
  }, []);

  function navigateToDashboard() {
    navigate("/dashboard");
  }

  const onInputLog = (e: any) => {
    if (e.target.id === "email") {
      setEmail(e.target.value);
    } else if (e.target.id === "password") {
      setPassword(e.target.value);
    }
  };

  const onSubmitLogin = async (e: any) => {
    e.preventDefault();
    try {
      const res = await postLogin({
        username: username,
        password: password,
      });
      const tokenData: IAuthResponse = res.data;
      setTokenData(tokenData);
      await setUser();
      navigateToDashboard();
    } catch (error: any) {
      if (error?.response?.status === 401) {
        toast.error("Неправильный логин и/или пароль!");
        return;
      }
      handleError(error, navigate);
    }
  };

  const onSubmitRegister = async (e: any) => {
    e.preventDefault();
    try {
      await postSingUp({
        username: username,
        password: password,
        name: fio,
        email: email,
      });
      toast.info(
        "Пользователь успешно зарегестрирован! Теперь вы можете войти",
      );
      setUsername("");
      setPassword("");
      setEmail("");
      setFio("");
      setIsLogin(true);
    } catch (error: any) {
      console.log("erroe!");
      if (error?.response.status === HttpStatusCode.BadRequest) {
        console.log("error 1");
        toast.error(
          "Пользователь не зарегистрирован. Возможно у вас отсутствует приглашение",
        );
      } else if (error?.response.status === HttpStatusCode.Conflict) {
        console.log("error 2");
        toast.error("Пользователь с такими данными уже существует!");
      } else {
        console.log("error 3");
        handleError(error);
      }
    }
  };

  function LoginPage() {
    return (
      <div className="container mx-auto flex h-full flex-col items-center justify-center px-4 text-font-color sm:p-0">
        <div className="h-fit w-full rounded-xl bg-secondary-color p-4 sm:w-[550px] sm:p-10">
          <form className="flex flex-col gap-4 sm:gap-6">
            <p className="mb-2 text-2xl font-bold sm:mb-4 sm:text-3xl">Вход</p>
            <div className="flex flex-col">
              <label
                className="mb-3 text-xl font-medium sm:text-2xl"
                htmlFor="username"
              >
                Логин*
              </label>
              <input
                required
                id="username"
                type="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={`rounded-xl border-[3px] bg-secondary-color px-6 py-2 text-xl focus:outline-none ${correct ? "border-red-500" : "border-blue-color"} `}
                placeholder="mycoolnick"
              />
            </div>
            <div className="flex flex-col">
              <label
                className="mb-3 text-xl font-medium sm:text-2xl"
                htmlFor="password"
              >
                Пароль*
              </label>
              <input
                required
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`bg-secondary-color px-6 py-2 text-xl ${correct ? "border-red-500" : "border-blue-color"} rounded-xl border-[3px] focus:outline-none`}
                placeholder="∗∗∗∗∗∗∗∗∗∗∗∗∗"
              />
            </div>
            <button
              onClick={onSubmitLogin}
              className="mt-4 rounded-xl bg-blue-color px-6 py-2 text-xl hover:bg-dark-blue-color sm:mt-6"
            >
              Войти
            </button>
          </form>
          <div className="mt-[30px] flex flex-col items-center font-bold sm:flex-row sm:justify-center sm:gap-8">
            <p className="text-lg sm:text-2xl">Нет аккаунта?</p>
            <p
              onClick={() => setIsLogin(false)}
              className="w-fit cursor-pointer rounded-bl-sm rounded-br-sm border-b-[3px] border-blue-color text-lg text-blue-color hover:text-dark-blue-color sm:text-2xl"
            >
              Зарегистрироваться
            </p>
          </div>
        </div>
      </div>
    );
  }

  function RegisterPage() {
    return (
      <div className="container mx-auto flex h-full flex-col items-center justify-center px-4 text-font-color sm:p-0">
        <div className="h-fit w-full rounded-xl bg-secondary-color p-4 sm:w-[550px] sm:p-10">
          <form className="flex flex-col gap-4 sm:gap-6">
            <p className="mb-2 text-2xl font-bold sm:mb-4 sm:text-3xl">
              Регистрация
            </p>
            <div className="flex flex-col">
              <label
                className="mb-3 text-xl font-bold sm:text-2xl"
                htmlFor="username"
              >
                Логин*
              </label>
              <input
                required
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="rounded-xl border-[3px] border-blue-color bg-secondary-color px-6 py-2 text-xl focus:outline-none"
                placeholder="ivanuser"
              />
            </div>
            <div className="flex flex-col">
              <label
                className="mb-3 text-xl font-bold sm:text-2xl"
                htmlFor="fio"
              >
                Фамилия Имя*
              </label>
              <input
                required
                id="fio"
                type="text"
                value={fio}
                onChange={(e) => setFio(e.target.value)}
                className="rounded-xl border-[3px] border-blue-color bg-secondary-color px-6 py-2 text-xl focus:outline-none"
                placeholder="Ivan Ivanov"
              />
            </div>
            <div className="flex flex-col">
              <label
                className="mb-3 text-xl font-bold sm:text-2xl"
                htmlFor="email"
              >
                Email*
              </label>
              <input
                required
                id="email"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-xl border-[3px] border-blue-color bg-secondary-color px-6 py-2 text-xl focus:outline-none"
                placeholder="ivan@example.com"
              />
            </div>
            <div className="flex flex-col">
              <label
                className="mb-3 text-xl font-bold sm:text-2xl"
                htmlFor="password"
              >
                Пароль*
              </label>
              <input
                required
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="rounded-xl border-[3px] border-blue-color bg-secondary-color px-6 py-2 text-xl focus:outline-none"
                placeholder="∗∗∗∗∗∗∗∗∗∗∗∗∗"
              />
            </div>
            <button
              onClick={onSubmitRegister}
              className="mt-4 rounded-xl bg-blue-color px-6 py-2 text-xl hover:bg-dark-blue-color sm:mt-6"
            >
              Зарегистрироваться
            </button>
          </form>
          <div className="mt-[30px] flex flex-col items-center font-bold sm:flex-row sm:justify-center sm:gap-8">
            <p className="text-lg sm:text-2xl">Уже есть аккаунт?</p>
            <p
              onClick={() => {
                setIsLogin(true);
              }}
              className={`w-fit cursor-pointer rounded-bl-sm rounded-br-sm border-b-[3px] border-blue-color text-lg text-blue-color hover:text-dark-blue-color sm:text-2xl`}
            >
              Войти
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="h-fit min-h-full w-full bg-background bg-cover py-10">
        {isLogin ? LoginPage() : RegisterPage()}
        <PredeclaredToastContainer />
      </div>
    </>
  );
}

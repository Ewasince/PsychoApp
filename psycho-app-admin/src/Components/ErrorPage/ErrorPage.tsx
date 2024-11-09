import { useRouteError } from "react-router-dom";
import { HttpStatusCode } from "axios";
import React from "react";

export const ErrorPage = () => {
  const error: any = useRouteError();
  console.error(error);

  return error?.response?.status === HttpStatusCode.NotFound ? (
    <>
      <div className="flex h-full w-full flex-col items-center justify-center">
        <p>Такой страницы не существует!</p>
        <a className="text-3xl font-bold" href="/">
          Вернуться на главную
        </a>
      </div>
    </>
  ) : (
    <div>
      <h1>Упс!</h1>
      <p>Извините, возникла неожиданная ошибка.</p>
      <p>
        <i>{error?.statusText || error?.message}</i>
      </p>
    </div>
  );
};

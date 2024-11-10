import * as React from "react";
import { useEffect, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { goToAuthUser } from "../../core/errors";

import { PredeclaredToastContainer } from "../componetsCore";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import DashboardIcon from "@mui/icons-material/Dashboard";
import BugReportIcon from "@mui/icons-material/BugReport";
import { getConfig } from "../../core/storage/config";
import { exitUser, isUserEntered } from "../../api/auth/common";

const DEFAULT_PATH = "/dashboard";

export const MainPage = () => {
  const [currentPage, setCurrentPage] = useState<string>(DEFAULT_PATH);
  const location = useLocation();
  const navigate = useNavigate();
  // const config = getConfig();

  useEffect(() => {
    if (!isUserEntered()) {
      exitUser();
      goToAuthUser(navigate);
      return;
    }
    setCurrentPage(location.pathname);
    if (location.pathname === "/") {
      navigate(DEFAULT_PATH);
    }
  }, [location]);

  const MenuElement = ({
    path,
    title,
    Icon,
  }: {
    path: string;
    title: string;
    Icon: any;
  }) => {
    return (
      <>
        <Link
          className={`flex w-full items-center gap-3 rounded-lg px-2 py-2 sm:px-4 ${currentPage === path ? "bg-blue-color" : "opacity-70"} `}
          to={path}
        >
          <Icon />
          <p className="hidden sm:block">{title}</p>
        </Link>
      </>
    );
  };

  const ExitElement = () => {
    return (
      <a
        className="flex w-full items-center gap-3 rounded-lg px-2 py-2 opacity-70 sm:px-4"
        href="/"
        onClick={exitUser}
      >
        <ExitToAppIcon />
        <p className="hidden sm:block">Выйти</p>
      </a>
    );
  };

  return (
    <div className="flex h-fit min-h-full w-full items-stretch justify-between bg-secondary-color text-font-color">
      <div className="flex min-w-[50px] flex-col items-start justify-between bg-primary-color px-2 sm:min-w-[200px] sm:px-4">
        <div className="mt-12 flex flex-col sm:ml-2">
          <p className="mb-6 hidden text-xl sm:block">Меню</p>
          <div className="flex flex-col gap-4">
            <MenuElement
              path="/dashboard"
              title="Главная"
              Icon={DashboardIcon}
            />
            <MenuElement
              path="/account"
              title="Профиль"
              Icon={AccountBoxIcon}
            />
            {getConfig().is_dev && (
              <MenuElement
                path="/test_page"
                title="Тест Апи"
                Icon={BugReportIcon}
              />
            )}
          </div>
        </div>
        <div className="mb-6 ml-2 mt-12 flex flex-col">
          <p className="mb-6 hidden text-xl sm:block"></p>
          <div className="flex flex-col gap-4">
            {/*{getMenuElement("/help", "Поддержка")}*/}
            {/*{getMenuElement("/settings", "Настройки")}*/}
            <ExitElement />
          </div>
        </div>
      </div>
      <div className="h-screen w-full p-4 md:p-6 xl:p-8">
        <Outlet />
      </div>
      <PredeclaredToastContainer />
    </div>
  );
};

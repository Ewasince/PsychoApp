import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IMe } from "../../../api/endpoints/apiAuth";
import { getGlobalUser } from "../../../core/storage/config";
import { Heading } from "../../componetsCore";

export const Account = () => {
  const [user, setUser] = useState<IMe>();
  const navigate = useNavigate();

  useEffect(() => {
    setUser(getGlobalUser());
  }, []);

  return (
    <div
      className={`flex w-full flex-col rounded-lg bg-secondary-color p-4 text-font-color sm:rounded-xl sm:p-6 xl:p-8`}
    >
      <Heading heading={`Профиль ${user?.name}`} />

      <div className="container mt-5 w-full">
        <div className="entry-container flex w-full flex-col gap-2 sm:flex-row sm:gap-4">
          <div className="grid w-full grid-cols-1 text-base sm:grid-cols-2 sm:gap-4 sm:text-lg">
            <div className="text-left font-medium sm:text-right">
              Ваш никнейм:
            </div>
            <div className="mb-2 mr-2 sm:mb-0">{user?.username}</div>

            <div className="text-left font-medium sm:text-right">
              Ваша почта:
            </div>
            <div className="mr-2">{user?.email || "—"}</div>
          </div>
        </div>

        <button
          onClick={() => {
            alert(
              "Находится в разработке. Пока пациенты могут свободно добавляться",
            );
          }}
          className="mt-4 w-full rounded-lg bg-blue-color px-4 py-2 text-base hover:bg-dark-blue-color sm:mt-6 sm:rounded-xl sm:px-6 sm:py-3 sm:text-xl"
        >
          Добавить пациента
        </button>
      </div>
    </div>
  );
};

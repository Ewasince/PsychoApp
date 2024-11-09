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
        <div className="entry-container flex w-full flex-row gap-1 sm:gap-2 2xl:flex-row">
          <div className="grid w-full grid-cols-2 gap-4 space-x-2 text-lg sm:text-xl">
            <div className="text-right font-medium">Ваш никнейм:</div>
            <div className="mr-2">{user?.username}</div>

            <div className="text-right font-medium">Ваша почта:</div>
            <div className="mr-2">{user?.email || "—"}</div>
          </div>
        </div>

        <button
          onClick={() => {
            alert(
              "Находится в разработке. Пока пациенты могут свободно добавляться",
            );
          }}
          className="mt-4 w-full rounded-xl bg-blue-color px-6 py-2 text-xl hover:bg-dark-blue-color sm:mt-6"
        >
          Добавить пациента
        </button>
      </div>
    </div>
  );
};

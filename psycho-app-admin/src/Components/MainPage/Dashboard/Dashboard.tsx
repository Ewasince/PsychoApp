import * as React from "react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getPatients, IPatient } from "../../../api/endpoints/apiPatients";
import { handleError } from "../../../core/errors";
import { Heading } from "../../componetsCore";

export const Dashboard = () => {
  const [patients, setPatients] = useState<IPatient[]>();
  const [emptyText, setEmptyText] = useState<string>(
    "Пока у вас нету ни одного пациента",
  );

  const navigate = useNavigate();

  useEffect(() => {
    getPatients()
      .then((res) => {
        setPatients(res.data);
      })
      .catch((err) => {
        handleError(err, navigate);
        setEmptyText("Ошибка при загрузке пациентов");
      });
  }, []);

  function getPatientBlock(patient: IPatient, patientId: number) {
    return (
      <div className="container mt-5" key={patientId}>
        <Link to={`/patient/${patient.id}`}>
          <div className="entry-container flex flex-col-reverse gap-1 sm:gap-2 2xl:flex-row">
            <div className="flex w-full flex-col 2xl:max-w-[310px]">
              <p className="text-lg font-medium sm:text-xl">
                {patient.firstName}
              </p>
              <p className="text-lg font-medium sm:text-xl">
                {patient.lastName}
              </p>
              {/*<p className="text-md sm:text-lg opacity-70">{author}</p>*/}
            </div>
            <div className="w-full flex-col items-start gap-5 opacity-70">
              {/* Прогресс-бар */}
              {/*<div className="flex flex-col w-full gap-3">*/}
              {/*    <div className="w-full h-4 bg-gray-300 rounded-sm overflow-hidden">*/}
              {/*        <div style={{width: `${course.progress}%`}} className="h-full bg-blue-500"></div>*/}
              {/*    </div>*/}
              {/*    <div className="flex justify-between items-end">*/}
              {/*        <div>{course.progress}% выполнено</div>*/}
              {/*        <div style={is_deadline_close ? {color: "#ff615a"} : {}}>до {deadlineDateStr}</div>*/}
              {/*    </div>*/}
              {/*</div>*/}
            </div>
          </div>
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="flex w-full flex-col rounded-lg bg-secondary-color p-4 text-font-color sm:rounded-xl sm:p-6 xl:p-8">
        <Heading heading="Мои пациенты" />
        <div className="flex flex-col gap-6">
          {patients && patients.length ? (
            patients.map((patients, patientId) =>
              getPatientBlock(patients, patientId),
            )
          ) : (
            <>
              <p className="text-center">{emptyText}</p>
            </>
          )}
        </div>
      </div>
    </>
  );
};

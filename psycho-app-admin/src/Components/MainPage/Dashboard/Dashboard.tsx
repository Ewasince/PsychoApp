import * as React from 'react';
import {useEffect, useState} from 'react';
import {Link, useNavigate} from "react-router-dom";
import {getPatients, IPatient} from "../../../api/endpoints/apiPatients";
import {handleError} from "../../../core/errors";
import {generateHeading} from "../../componetsCore";

export const Dashboard = () => {
    const [patients, setPatients] = useState<IPatient[]>();
    const [emptyText, setEmptyText] = useState<string>("Пока у вас нету ни одного пациента");

    const navigate = useNavigate()

    useEffect(() => {
        getPatients()
            .then(res => {
                setPatients(res.data);
            })
            .catch(err => {
                handleError(err, navigate)
                setEmptyText("Ошибка при загрузке пациентов")
            })
    }, [])

    function getPatientBlock(patient: IPatient, patientId: number) {
        return (
            <div className="container mt-5" key={patientId}>
                <Link to={`/patient/${patient.id}`}>
                    <div className="entry-container flex flex-col-reverse 2xl:flex-row gap-1 sm:gap-2">
                        <div className="flex flex-col w-full 2xl:max-w-[310px]">
                            <p className="text-lg sm:text-xl font-medium">{patient.firstName}</p>
                            <p className="text-lg sm:text-xl font-medium">{patient.lastName}</p>
                            {/*<p className="text-md sm:text-lg opacity-70">{author}</p>*/}
                        </div>
                        <div className="opacity-70 flex-col w-full items-start gap-5">
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

        )
    }

    return (
        <>
            <div
                className="w-full bg-secondary-color rounded-lg sm:rounded-xl p-4 sm:p-6 xl:p-8 text-font-color flex flex-col">
                {generateHeading("Мои кореша")}
                <div className="flex flex-col gap-6">
                    {patients && patients.length ?
                        patients.map((patients, patientId) => getPatientBlock(patients, patientId)) :
                        <>
                            <p className="text-center">{emptyText}</p>
                        </>}
                </div>
            </div>
        </>

    );
};

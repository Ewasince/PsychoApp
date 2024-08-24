import * as React from 'react';
import {useEffect, useState} from 'react';
import {Link, useNavigate, useParams} from "react-router-dom";
import {getPatient, getPatients, getPatientStories, IPatient, IStory} from "../../../api/endpoints/apiPatients";
import {handleError} from "../../../core/errors";
import {generateBackButton, generateHeading} from "../../componetsCore";

// import {forbidden, generateHeading, logError} from "../../core/core";
// import {getConfig} from "../../core/storage";
// import {getStudentCourses} from "../../api/endpoints/apiDashboard";
// import {IResponseCourse} from "../../api/endpoints/apiCourses";

// interface Dictionary<T> {
//     [Key: string]: T;
// }

export const PatientBoard = () => {
    // const [courses, setCourses] = useState<IResponseCourse[]>();
    const [patient, setPatient] = useState<IPatient>();
    const [stories, setStories] = useState<IStory[]>([]);
    const [emptyText, setEmptyText] = useState<string>("Пока у вас нету ни одного пациента");
    // const [courseAuthors, setCourseAuthors] = useState<Record<string, string>>({})

    const navigate = useNavigate()
    const {patientId} = useParams()


    useEffect(() => {
        getPatient({}, patientId as string)
            .then(res => {
                setPatient(res.data);
            })
            .catch(err => {
                handleError(err, navigate)
            })
        getPatientStories({}, patientId as string, "story")
            .then(res => {
                setStories(res.data);
            })
            .catch(err => {
                handleError(err, navigate)
            })
    }, [])

    // function fillAuthors() {
    //     return
    //     // courses?.forEach(course => {
    //     //     getTutorCourse()
    //     //         .then(res => {
    //     //             const course: IResponseCourse = res.data
    //     //             courseAuthors[course.id]
    //     //         })
    //     // })
    // }


    // if (!getConfig().accessRights.isStudent) {
    //     return forbidden()
    // }

    function getStoryBlock(patient: IPatient, patientId: number) {
        // const deadlineDateStr = format(course.deadline, "dd.MM.yyyy HH:mm")
        // const is_deadline_close = differenceInDays(course.deadline, new Date()) < deadlineRed
        // const author = Object.hasOwn(courseAuthors, course.id) ? courseAuthors[course.id] : ""
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
                {generateHeading(`Дневник ${patient?.firstName}`, generateBackButton("/dashboard", "Назад к списку корешей"))}
                <div className="flex flex-col gap-6">
                    {/*{patients && patients.length ?*/}
                    {/*    patients.map((patients, patientId) => getStoryBlock(patients, patientId)) :*/}
                    {/*    <>*/}
                    {/*        <p className="text-center">{emptyText}</p>*/}
                    {/*    </>}*/}

                    <div className="flex flex-col h-full">
                        <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
                            <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
                                <div className="overflow-hidden shadow-md sm:rounded-lg">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                        <tr>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                            >
                                                Дата
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                            >
                                                Ситуация
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                            >
                                                Мысль
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                            >
                                                Эмоция
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                            >
                                                Сила эмоции
                                            </th>
                                        </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                        {stories.map((story) => (
                                            <tr key={story.id}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{story.date}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{story.situation}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{story.mind}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{story.emotion}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{story.emotionPower}</td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>

    );
};

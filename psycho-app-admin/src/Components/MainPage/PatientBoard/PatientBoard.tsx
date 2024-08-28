import * as React from 'react';
import {useEffect, useState} from 'react';
import {useNavigate, useParams} from "react-router-dom";
import {
    getPatient,
    getPatientStories,
    getPatientStoriesMinDate,
    IPatient,
    IStory
} from "../../../api/endpoints/apiPatients";
import {handleError} from "../../../core/errors";

import {Pagination} from "flowbite-react";
import dayjs, {Dayjs} from "dayjs";
import weekday from "dayjs/plugin/weekday";

dayjs.extend(weekday)

export const PatientBoard = () => {
    const [patient, setPatient] = useState<IPatient>();
    const [stories, setStories] = useState<IStory[]>([]);
    const [minDate, setMinDate] = useState<Dayjs>();
    const [todayDate, setTodayDate] = useState<Dayjs>();
    const [countPages, setCountPages] = useState<number>(5);
    const [emptyText, setEmptyText] = useState<string>("Пока у вас нету ни одного пациента");

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
        getPatientStoriesMinDate({}, patientId as string, "story")
            .then(res => {
                const minDate = dayjs(res.data.minDate * 1000)
                setMinDate(minDate);

                const todayDate = dayjs()
                setTodayDate(todayDate)

                const countWeeks = Math.ceil(todayDate.diff(minDate, 'day') / 7)
                setCountPages(countWeeks)

                fetchStories(minDate, todayDate)
            })
            .catch(err => {
                handleError(err, navigate)
            })
    }, [])

    function fetchStories(dateStart: Dayjs, dateFinish: Dayjs) {
        getPatientStories({
            params: {
                dateStart: dateStart.unix(),
                dateFinish: dateFinish.unix(),
            }
        }, patientId as string, "story")
            .then(res => {
                setStories(res.data.stories)
            })
            .catch(err => {
                handleError(err, navigate)
            })
    }

    const [page, setPage] = useState(<div>{emptyText}</div>);

    const [currentPage, setCurrentPage] = useState(1);
    const onPageChange = (page: number) => {
        const [startDate, endDate] = getWeekDates(page - 1)
        setPage(<>
            <h1>Week starts from {startDate.toString()} to {endDate.toString()}!</h1>
        </>)
        setCurrentPage(page);
    }

    function getWeekDates(weekNum: number): [Dayjs, Dayjs] { // 0 week means is current
        const lastMonday = dayjs().weekday(-6)
        const sundayForLastMonday = lastMonday.add(1, 'week') // last monday

        const startDate = sundayForLastMonday.subtract(weekNum, 'week')
        const endDate = lastMonday.subtract(weekNum, 'week')

        return [startDate, endDate]
    }

    return (
        <>
            {page}
            <div className="flex overflow-x-auto sm:justify-center">
                <Pagination currentPage={currentPage} totalPages={countPages} onPageChange={onPageChange}/>
            </div>
        </>
    );
};

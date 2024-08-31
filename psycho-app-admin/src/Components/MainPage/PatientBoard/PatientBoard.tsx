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
    const [storiesByWeek, setStoriesByWeek] = useState<Map<number, IStory[]>>(new Map([]));
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
                const minDate = dayjs.unix(res.data.minDate)
                setMinDate(minDate);

                const todayDate = dayjs()
                setTodayDate(todayDate)

                const countWeeks = Math.ceil(todayDate.diff(minDate, 'day') / 7)
                setCountPages(countWeeks)

                fetchStories(minDate, todayDate)

                onPageChange(1)
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
                console.log("getPatientStories", res.data)
                processStoriesByWeek(res.data.stories)
            })
            .catch(err => {
                handleError(err, navigate)
            })
    }

    function processStoriesByWeek(stories: IStory[]) {
        const storiesByWeek = new Map<number, IStory[]>();
        for (const story of stories) {
            const weekNum = getWeekNum(dayjs.unix(story.date))
            if (!storiesByWeek.has(weekNum)) {
                storiesByWeek.set(weekNum, [])
            }
            storiesByWeek.get(weekNum)?.push(story)
        }
        setStoriesByWeek(storiesByWeek)
    }


    const [page, setPage] = useState(<div>{emptyText}</div>);

    const [currentPage, setCurrentPage] = useState(1);
    const getStoryBlock = (story: IStory) => {
        return (<>
            <p>{story.date}</p>
            <p>"{story.situation}"</p>
        </>)
    }
    const onPageChange = (page: number) => {
        const [startDate, endDate] = getWeekDates(page - 1)
        setPage(<>
            <h1>Week starts from {startDate.toString()} to {endDate.toString()}!</h1>
            <p>{storiesByWeek.get(page - 1)?.map(getStoryBlock)}</p>
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

    function getWeekNum(date: Dayjs): number { // 0 week means is current
        const lastMonday = dayjs().weekday(-6)
        const sundayForLastMonday = lastMonday.add(1, 'week') // last monday

        return (sundayForLastMonday.diff(date) % 7 | 0)+ 1
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

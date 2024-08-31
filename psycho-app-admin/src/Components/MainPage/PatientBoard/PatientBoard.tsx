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
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

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
    const data = [
        { id: 1, name: 'Анна Иванова', age: 29, gender: 'Женский', diagnosis: 'Тревожное расстройство', notes: 'Начало терапии: Январь 2024' },
        { id: 2, name: 'Дмитрий Петров', age: 34, gender: 'Мужской', diagnosis: 'Депрессия', notes: 'Начало терапии: Февраль 2024' },
        { id: 3, name: 'Ольга Смирнова', age: 41, gender: 'Женский', diagnosis: 'Биполярное расстройство', notes: 'Начало терапии: Март 2024' },
        // Добавьте больше данных по необходимости
    ];
    const PsychologyTable = () => {
        return (
            <TableContainer component={Paper} className="shadow-md rounded-lg">
                <Table>
                    <TableHead className="bg-blue-500">
                        <TableRow>
                            <TableCell className="text-white">Имя</TableCell>
                            <TableCell className="text-white">Возраст</TableCell>
                            <TableCell className="text-white">Пол</TableCell>
                            <TableCell className="text-white">Диагноз</TableCell>
                            <TableCell className="text-white">Примечания</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map((row) => (
                            <TableRow key={row.id} className="hover:bg-blue-100 transition duration-300">
                                <TableCell>{row.name}</TableCell>
                                <TableCell>{row.age}</TableCell>
                                <TableCell>{row.gender}</TableCell>
                                <TableCell>{row.diagnosis}</TableCell>
                                <TableCell>{row.notes}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        );
    }

    return (
        <>
            {PsychologyTable()}
            {/*{page}*/}
            <div className="flex overflow-x-auto sm:justify-center">
                <Pagination currentPage={currentPage} totalPages={countPages} onPageChange={onPageChange}/>
            </div>
        </>
    );
};

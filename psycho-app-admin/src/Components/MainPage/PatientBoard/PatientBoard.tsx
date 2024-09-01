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

import dayjs, {Dayjs} from "dayjs";
import weekday from "dayjs/plugin/weekday";
import {Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from '@mui/material';
import Pagination from '@mui/material/Pagination';
import "dayjs/locale/ru"

dayjs.extend(weekday)
dayjs.locale('ru')


type IStoryDto = {
    id: number
    date: Dayjs
    situation: string
    mind: string
    emotion: string
    emotionPower: number
}

export const PatientBoard = () => {
    dayjs.locale('ru')

    const [patient, setPatient] = useState<IPatient>();
    const [storiesByWeek, setStoriesByWeek] = useState<Map<number, IStoryDto[]>>(new Map([]));
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
        const storiesByWeek = new Map<number, IStoryDto[]>();
        for (const story of stories) {
            const weekNum = getWeekNum(dayjs.unix(story.date))
            if (!storiesByWeek.has(weekNum)) {
                storiesByWeek.set(weekNum, [])
            }
            const storyDto: IStoryDto = {
                id: story.id,
                date: dayjs.unix(story.date),
                situation: story.situation,
                mind: story.mind,
                emotion: story.emotion,
                emotionPower: story.emotionPower,
            }
            storiesByWeek.get(weekNum)?.push(storyDto)
        }
        setStoriesByWeek(storiesByWeek)
    }

    const [currentPage, setCurrentPage] = useState(1);
    const onPageChange = (page: number) => {
        setCurrentPage(page);
    }

    function getWeekDates(weekIndex: number): [Dayjs, Dayjs] { // 0 week means is current
        const lastMonday = dayjs().weekday(-6)
        const sundayForLastMonday = lastMonday.add(1, 'week') // last monday

        const startDate = lastMonday.subtract(weekIndex, 'week')
        const endDate = sundayForLastMonday.subtract(weekIndex, 'week')

        return [startDate, endDate]
    }

    function getWeekNum(date: Dayjs): number { // 0 week means is current
        const lastMonday = dayjs().weekday(-6)
        const sundayForLastMonday = lastMonday.add(1, 'week') // last monday

        return (sundayForLastMonday.diff(date) % 7 | 0) + 1
    }

    const KptTable = () => {
        const weekIndex = currentPage - 1
        const [startDate, endDate] = getWeekDates(weekIndex)

        const currentStories = storiesByWeek.get(weekIndex) || []

        function getStoryRow(story: IStoryDto) {
            return (<>
                <TableRow key={story.id} className="hover:bg-blue-100 transition duration-300">
                    <TableCell>{story.date.toString()}</TableCell>
                    <TableCell>{story.situation}</TableCell>
                    <TableCell>{story.mind}</TableCell>
                    <TableCell>{story.emotion}</TableCell>
                    <TableCell>{story.emotionPower}</TableCell>
                </TableRow>
            </>)
        }

        return (<>
                <TableContainer component={Paper} className="shadow-md rounded-lg">
                    <Table>
                        <TableHead className="bg-blue-500">
                            <TableRow>
                                <TableCell className="text-white">Время</TableCell>
                                <TableCell className="text-white">Ситуация</TableCell>
                                <TableCell className="text-white">Автоматическая мысль</TableCell>
                                <TableCell className="text-white">Эмоция</TableCell>
                                <TableCell className="text-white">Сила эмоции</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {currentStories.map(getStoryRow)}
                        </TableBody>
                    </Table>
                </TableContainer>
            </>
        );
    }


    const handlePageChange = (event: any, value: number) => {
        setCurrentPage(value);
    };

    return (
        <>
            <KptTable/>

            <Pagination
                style={{
                    backgroundColor: "white",
                    color: "red"
                }}
                count={countPages}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
                variant="outlined"
                shape="rounded"
                showFirstButton
                showLastButton
            />
        </>
    );
};

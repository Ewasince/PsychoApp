import {Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";
import * as React from "react";
import dayjs, {Dayjs} from "dayjs";

export type IStoryDto = {
    id: number
    date: Dayjs
    situation: string
    mind: string
    emotion: string
    emotionPower: number
}

function getWeekDates(weekIndex: number): [Dayjs, Dayjs] { // 0 week means is current
    const lastMonday = dayjs().weekday(-6)
    const sundayForLastMonday = lastMonday.add(1, 'week') // last monday

    const startDate = lastMonday.subtract(weekIndex, 'week')
    const endDate = sundayForLastMonday.subtract(weekIndex, 'week')

    return [startDate, endDate]
}


export const KptTable = (
    {
        weekIndex,
        storiesByWeek
    }: {
        weekIndex: number,
        storiesByWeek: Map<number, IStoryDto[]>,
    }) => {
    const currentStories = storiesByWeek.get(weekIndex)

    function getStoryRow(story: IStoryDto) {
        return (<>
            <TableRow key={story.id} className="hover:bg-thirdy-color transition duration-300">
                <TableCell>{story.date.toString()}</TableCell>
                <TableCell>{story.situation}</TableCell>
                <TableCell>{story.mind}</TableCell>
                <TableCell>{story.emotion}</TableCell>
                <TableCell>{story.emotionPower}</TableCell>
            </TableRow>
        </>)
    }

    const emptyTable = <>
        <TableRow key={0} className="hover:bg-thirdy-color transition duration-300">
            <TableCell colSpan={5}>
                <div className="text-center font-medium">
                    На выбранной неделе записей нет
                </div>
            </TableCell>
        </TableRow>
    </>

    return (<>
            <TableContainer component={Paper} className="shadow-md rounded-lg">
                <Table>
                    <TableHead className="bg-primary-color">
                        <TableRow>
                            <TableCell className="text-white">Время</TableCell>
                            <TableCell className="text-white">Ситуация</TableCell>
                            <TableCell className="text-white">Автоматическая мысль</TableCell>
                            <TableCell className="text-white">Эмоция</TableCell>
                            <TableCell className="text-white">Сила эмоции</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {currentStories ? currentStories.map(getStoryRow) : emptyTable}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
}

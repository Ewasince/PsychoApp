import * as React from 'react';
import {Fragment, useEffect, useState} from 'react';
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
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Menu,
    MenuItem,
    PaginationItem,
} from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import Pagination from '@mui/material/Pagination';
import "dayjs/locale/ru"
import {generateBackButton, Heading} from "../../componetsCore";
import {IStoryDto, KptTable} from "./KPTable";

dayjs.extend(weekday)
dayjs.locale('ru')


export const PatientBoard = () => {
    dayjs.locale('ru')

    const [patient, setPatient] = useState<IPatient>();
    const [storiesByWeek, setStoriesByWeek] = useState<Map<number, IStoryDto[]>>(new Map([]));
    const [countPages, setCountPages] = useState<number>(5);

    const navigate = useNavigate()
    const {patientId} = useParams()


    useEffect(() => {
        if (typeof patientId != "string") {
            handleError(new Error("no patientId param"), navigate)
        }
        getPatient(patientId as string)
            .then(res => {
                setPatient(res.data);
            })
            .catch(err => {
                handleError(err, navigate)
            })
        getPatientStoriesMinDate(patientId as string)
            .then(res => {
                const minDate = dayjs.unix(res.data.minDate)
                const todayDate = dayjs()
                fetchStories(minDate, todayDate)
            })
            .catch(err => {
                handleError(err, navigate)
            })
    }, [])

    function fetchStories(dateStart: Dayjs, dateFinish: Dayjs) {
        getPatientStories(
            patientId as string,
            {
                dateStart: dateStart.unix(),
                dateFinish: dateFinish.unix(),
            },
        )
            .then(res => {
                processStoriesByWeek(res.data.stories)
            })
            .catch(err => {
                handleError(err, navigate)
            })
    }

    function processStoriesByWeek(stories: IStory[]) {
        const storiesByWeek = new Map<number, IStoryDto[]>();
        let maxWeekAgo = 0
        for (const story of stories) {
            const storyDate = dayjs.unix(story.date)
            const weekNum = getWeekNumFromDate(storyDate)
            console.log(`weekNum=${weekNum} storyDate=${storyDate}`)
            maxWeekAgo = Math.max(maxWeekAgo, weekNum)
            if (!storiesByWeek.has(weekNum)) {
                storiesByWeek.set(weekNum, [])
            }
            const storyDto: IStoryDto = { // TODO: конечно хуёвый способ так делать, нужно это в отдельный класс вынести
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

        maxWeekAgo++
        setCountPages(maxWeekAgo)
        setCurrentPage(0)
    }

    const [currentPage, setCurrentPage] = useState(1);

    function getWeekNumFromDate(date: Dayjs): number { // 0 week means is current, 1 – week ago
        const nextMonday = dayjs()
            .weekday(7)
            .set("millisecond", 0)
            .set("seconds", 0)
            .set("minutes", 0)
            .set("hours", 3) // shift from UTC to GMT+3

        return nextMonday.diff(date, 'week')
    }

    const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
    const open = Boolean(menuAnchor);
    const [openAlert, setOpenAlert] = useState<boolean>(false);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setMenuAnchor(event.currentTarget);
    };
    const handleCloseMenu = (el: any) => {
        if (el.target.id === "delete-patient") {
            setOpenAlert(true)
        }
        setMenuAnchor(null);
    };
    const handleCloseAlert = (el: any) => {
        if (el.target.id === "delete-submit") {
            alert(`Вы "удалили" ${patient?.firstName} (в разработке)`)
        }
        setOpenAlert(false)
    };

    const CustomMenu = () => (
        <>
            <Button
                id="basic-button"
                aria-controls={open ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
            >
                <SettingsIcon
                    className={'text-gray-600'}
                    // color={`secondary`}
                />
            </Button>
            <Menu
                id="basic-menu"
                anchorEl={menuAnchor}
                open={open}
                onClose={handleCloseMenu}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
            >
                <MenuItem id="delete-patient" onClick={handleCloseMenu}>Удалить пациента</MenuItem>
            </Menu>

            <Dialog
                open={openAlert}
                onClose={() => setOpenAlert(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Подтвердите действие"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Вы уверены, что хотите удалить <b>{patient?.firstName}?</b> Это действие нельзя отменить
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button id="delete-cancel" onClick={handleCloseAlert}>Отмена</Button>
                    <Button id="delete-submit" onClick={handleCloseAlert} autoFocus>
                        Удалить
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )

    return (
        <div className={`flex flex-col h-full`}>
            <Heading
                heading={`Дневник ${patient?.firstName}`}
                backButton={generateBackButton("/dashboard")}
            />
            <div className={`flex flex-col items-center space-y-5 flex-grow`}>
                <div className={`flex flex-row justify-between w-full`}>
                    <div className={`flex flex-row w-full space-x-5 items-center`}>
                        <p>Недель назад: </p>

                        <Pagination
                            count={countPages}
                            page={currentPage + 1}
                            onChange={(event, value) => setCurrentPage(value - 1)}
                            color="primary"
                            variant="outlined"
                            shape="rounded"
                            showFirstButton
                            // showLastButton
                            renderItem={(item) => (
                                <PaginationItem
                                    {...item}
                                    page={
                                        item.page === 1 ? "Эта" :
                                            // item.page === 2 ? "Предыдущая" :
                                            typeof item.page === "number" ? item.page - 1 :
                                                item.page
                                    }
                                />
                            )}
                        />
                    </div>

                    {CustomMenu()}
                </div>
                <div className="flex flex-col justify-between w-full h-full">
                    <KptTable
                        weekIndex={currentPage}
                        storiesByWeek={storiesByWeek}
                    />

                    <p>Stub</p>
                </div>

            </div>
        </div>
    );
};

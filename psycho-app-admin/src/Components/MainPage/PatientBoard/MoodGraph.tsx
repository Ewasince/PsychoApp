import * as React from "react";
import {Dayjs} from "dayjs";
import {Line,} from "react-chartjs-2";
import {CategoryScale, Chart as ChartJS, ChartData, LinearScale, LineElement, PointElement, Title} from "chart.js";


ChartJS.register(LineElement, PointElement, LinearScale, Title, CategoryScale);


export type IMoodDto = {
    id: number
    date: Dayjs
    value: number
}
export type MoodsArray = (IMoodDto | undefined)[]


function graphPrepareData(data: (number | undefined)[]): ChartData<"line", (number | undefined)[], string> {
    return {
        labels: ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"],
        datasets: [
            {
                label: "First dataset",
                data: data,
                // fill: true,
                // backgroundColor: "rgba(75,192,192,0.2)",
                borderColor: "rgb(255,148,56)",
                borderWidth: 4,
                tension: 0.4, // Увеличение сглаживания

                pointBackgroundColor: "rgba(251, 218, 188, 0.5)",
                pointRadius: 8, // Размер точек
                pointHoverRadius: 10, // Размер точек при наведении
            },
        ]
    }
}


const graphOptions = {
    responsive: true,
    maintainAspectRatio: false, // Отключаем сохранение пропорций, чтобы растянуть график
    scales: {
        y: {
            min: -5, // Минимальное значение по вертикальной оси
            max: 5, // Максимальное значение по вертикальной оси
        },
    },
};


export const MoodGraph = (
    {
        weekIndex,
        moodsByWeek,
    }: {
        weekIndex: number,
        moodsByWeek: Map<number, MoodsArray>,
    }) => {
    const currentMoods = moodsByWeek.get(weekIndex) || []

    const currentMoodsVals = []

    for (const mood of currentMoods) {
        currentMoodsVals.push(mood?.value)
    }

    return (
        <Line data={graphPrepareData(currentMoodsVals)} options={graphOptions}/>
    );
}

import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
} from "@mui/material";
import * as React from "react";
import dayjs, { Dayjs } from "dayjs";
import { Marks } from "../../../api/endpoints/apiPatients";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import ErrorIcon from "@mui/icons-material/Error";

export type IStoryDto = {
  id: number;
  date: Dayjs;
  situation: string;
  mind: string;
  emotion: string;
  emotionPower: number;
  mark: Marks;
};

function getWeekDates(weekIndex: number): [Dayjs, Dayjs] {
  // 0 week means is current
  const lastMonday = dayjs().weekday(-6);
  const sundayForLastMonday = lastMonday.add(1, "week"); // last monday

  const startDate = lastMonday.subtract(weekIndex, "week");
  const endDate = sundayForLastMonday.subtract(weekIndex, "week");

  return [startDate, endDate];
}

const headerStyle = { backgroundColor: "var(--primary-color)" }

export const KptTable = ({
                           weekIndex,
                           storiesByWeek,
                         }: {
  weekIndex: number;
  storiesByWeek: Map<number, IStoryDto[]>;
}) => {
  const currentStories = storiesByWeek.get(weekIndex);

  function getStoryRow(story: IStoryDto) {
    return (
        <>
          <TableRow
              key={story.id}
              className="transition duration-300 hover:bg-thirdy-color"
          >
            <TableCell>qwe{story.date.format("DD.MM.YYYY")}</TableCell>
            <TableCell>{story.situation}</TableCell>
            <TableCell>{story.mind}</TableCell>
            <TableCell>{story.emotion}</TableCell>
            <TableCell>{story.emotionPower}</TableCell>
            <TableCell>{getSeverityIcon(story.mark)}</TableCell>
          </TableRow>
        </>
    );
  }

  const emptyTable = (
      <>
        <TableRow
            key={0}
            className="transition duration-300 hover:bg-thirdy-color"
        >
          <TableCell colSpan={6}>
            <div className="text-center font-medium">
              На выбранной неделе записей нееет
            </div>
          </TableCell>
        </TableRow>
      </>
  );

  return (
      <TableContainer
          component={Paper}
          className={`h-fit max-h-full rounded-lg shadow-md`}
      >
        <Table sx={{ tableLayout: "fixed" }} stickyHeader>
          <TableHead>
            <TableRow>
              {/* TODO: разобраться почему stickyHeader перезаписывает backgroundColor */}
              <TableCell
                  width="10%"
                  style={headerStyle}
              >
                Время
              </TableCell>
              <TableCell
                  width="30%"
                  style={headerStyle}
              >
                Ситуация
              </TableCell>
              <TableCell
                  width="30%"
                  style={headerStyle}
              >
                Автоматическая мысль
              </TableCell>
              <TableCell
                  width="15%"
                  style={headerStyle}
              >
                Эмоция
              </TableCell>
              <TableCell
                  width="7%"
                  style={headerStyle}
              >
                Сила эмоции
              </TableCell>
              <TableCell
                  width="5%"
                  style={headerStyle}
              ></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentStories ? currentStories.map(getStoryRow) : emptyTable}
          </TableBody>
        </Table>
      </TableContainer>
  );
};

function getSeverityIcon(severity: Marks) {
  switch (severity) {
    case 0: {
      return <></>;
    }
    case 1: {
      return (
          <Tooltip title="Не требует пристального внимания" arrow>
            <ErrorOutlineIcon sx={{ color: "#ffbc29" }} />
          </Tooltip>
      );
    }
    case 2: {
      return (
          <Tooltip title="Возможно стоит обратить внимание" arrow>
            <ErrorIcon sx={{ color: "#ffbc29" }} />
          </Tooltip>
      );
    }
    case 3: {
      return (
          <Tooltip title="Стоит обратить внимание" arrow>
            <ErrorIcon sx={{ color: "#ff5722" }} />
          </Tooltip>
      );
    }
  }
}

import Calendar from 'react-calendar';
import { format, isSunday, isSaturday } from 'date-fns';
import { ko } from 'date-fns/locale';
import 'react-calendar/dist/Calendar.css';
import styled from 'styled-components';

interface MarkedDateStyles {
    customStyles?: {
        container?: {
            borderBottomWidth?: number;
            borderBottomColor?: string;
        };
    };
}

interface CustomCalendarProps {
    markedDates: Record<string, MarkedDateStyles>;
}

const StyledCalendarContainer = styled.div`
    .react-calendar {
        width: 100%;
        border: none;
        background-color: white;
        font-family: Arial, Helvetica, sans-serif;
        box-shadow: none;
        padding: 10px;
    }

    .react-calendar__navigation {
        margin-bottom: 20px;
        background-color: white;
        padding: 10px;
    }

    .react-calendar__navigation button {
        color: #735BF2;
        font-size: 16px;
        min-width: 36px;
        background: none;

        &:hover {
            background: none;
        }

        &:disabled {
            background: none;
        }
    }

    .react-calendar__navigation__label {
        font-weight: bold;
        color: #735BF2;
        pointer-events: none;
    }

    .react-calendar__month-view__weekdays {
        font-weight: normal;
        font-size: 16px;
        margin-bottom: 10px;
        abbr {
            text-decoration: none;
        }
    }

    .react-calendar__tile {
        padding: 0.75em 0.5em;
        font-size: 16px;
        border-radius: 4px;
        color: #000;
        pointer-events: none;

        &:hover {
            background: none;
        }

        &:enabled:hover {
            background: none;
            color: inherit;
        }
    }

    .sunday {
        color: #f87171 !important;
    }

    .saturday {
        color: #3b82f6 !important;
    }

    .marked-date {
        background-color: #FFF9C4;
    }

    /* 이전/다음 달 날짜 숨기기 */
    .react-calendar__month-view__days__day--neighboringMonth {
        visibility: hidden;
    }

    /* 모든 hover 효과 제거 */
    * {
        &:hover {
            background: none !important;
        }
    }

    .react-calendar__month-view__weekdays__weekday {
        &.sunday {
            color: #f87171;
            abbr {
                color: #f87171;
            }
        }
        &.saturday {
            color: #3b82f6;
            abbr {
                color: #3b82f6;
            }
        }
    }
`;

export default function CustomCalendar({ markedDates }: CustomCalendarProps) {
    const tileClassName = ({ date }: { date: Date; view: string }) => {
        const formattedDate = format(date, 'yyyy-MM-dd');
        const isMarked = markedDates[formattedDate];
        const classes = ['relative flex justify-center items-center'];

        if (isMarked) {
            classes.push('marked-date');
        }

        if (isSunday(date)) {
            classes.push('sunday');
        } else if (isSaturday(date)) {
            classes.push('saturday');
        }

        return classes.join(' ');
    };

    const formatShortWeekday = (_: string | undefined, date: Date): string => {
        const dayStr = format(date, 'E', { locale: ko });
        return dayStr;
    };

    return (
        <StyledCalendarContainer>
            <Calendar
                formatMonth={(_, date) => format(date, 'MM월', { locale: ko })}
                formatYear={(_, date) => format(date, 'yyyy년', { locale: ko })}
                formatMonthYear={(_, date) => format(date, 'yyyy년 MM월', { locale: ko })}
                formatShortWeekday={formatShortWeekday}
                formatDay={(_, date) => format(date, 'd')}
                maxDetail="month"
                minDetail="month"
                calendarType="gregory"
                tileClassName={tileClassName}
                next2Label={null}
                prev2Label={null}
                showNeighboringMonth={false}
                locale="ko"
                prevLabel="‹"
                nextLabel="›"
                navigationLabel={({ date }) =>
                    `${format(date, 'yyyy년 MM월', { locale: ko })}`
                }
                onClickDay={(_, event) => {
                    event.preventDefault();
                }}
                onClickMonth={(_, event) => {
                    event.preventDefault();
                }}
            />
        </StyledCalendarContainer>
    );
}
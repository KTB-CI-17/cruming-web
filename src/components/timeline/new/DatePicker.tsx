import { useState } from 'react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { CalendarIcon, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

interface DatePickerProps {
    value: string;
    onChange: (date: string) => void;
}

type CalendarType = typeof Calendar;
type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

const localeKo: CalendarType['defaultProps'] = {
    maxDetail: 'month',
    minDetail: 'month',
    view: 'month',
    locale: 'ko-KR',
    calendarType: 'gregory',
    formatMonth: (_, date) => format(date, 'MM월', { locale: ko }),
    formatYear: (_, date) => format(date, 'yyyy년', { locale: ko }),
    formatMonthYear: (_, date) => format(date, 'yyyy년 MM월', { locale: ko }),
    formatShortWeekday: (_, date) => format(date, 'E', { locale: ko }),
    formatDay: (_, date) => format(date, 'd')
};

export default function DatePicker({ value, onChange }: DatePickerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const today = new Date();

    const formattedDate = value
        ? format(new Date(value), 'yyyy년 MM월 dd일', { locale: ko })
        : '';

    const handleDayClick = (date: Date) => {
        onChange(format(date, 'yyyy-MM-dd'));
        setIsOpen(false);
    };

    return (
        <div className="relative">
            <button
                type="button"
                onClick={() => setIsOpen(true)}
                className="w-full p-3 border border-gray-200 rounded-lg flex justify-between items-center"
            >
                <span className={value ? 'text-black' : 'text-gray-400'}>
                    {formattedDate || '* 활동 일자'}
                </span>
                <CalendarIcon className="w-5 h-5 text-gray-400" />
            </button>

            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-6"
                    onClick={() => setIsOpen(false)}
                >
                    <div
                        className="bg-white rounded-lg w-full max-w-md"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="p-4 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-center">날짜 선택</h3>
                        </div>
                        <Calendar
                            {...localeKo}
                            value={value ? new Date(value) : null}
                            onChange={(value: Value) => {
                                if (value instanceof Date) {
                                    handleDayClick(value);
                                }
                            }}
                            maxDate={today}
                            className="w-full border-none"
                            navigationLabel={({ date }) =>
                                format(date, 'yyyy년 MM월', { locale: ko })
                            }
                            prevLabel={<ChevronLeft className="w-4 h-4" />}
                            nextLabel={<ChevronRight className="w-4 h-4" />}
                            prev2Label={<ChevronsLeft className="w-4 h-4" />}
                            next2Label={<ChevronsRight className="w-4 h-4" />}
                            tileClassName={({ date }) => {
                                const day = format(date, 'E', { locale: ko });
                                let className = "h-10 w-10 rounded-full flex items-center justify-center hover:bg-blue-50";

                                if (day === '일') className += ' text-red-500';
                                if (day === '토') className += ' text-red-500';

                                return className;
                            }}
                            tileDisabled={({ date }) => {
                                return date > today;
                            }}
                            showNeighboringMonth={false}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
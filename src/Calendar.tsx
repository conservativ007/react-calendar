import { useEffect, useState } from "react";
import "./Calendar.css";
import "./Person.css";

import arrowPrev from "../public/arrow-left.png";
import arrowNext from "../public/arrow-right.png";
import arrowDown from "../public/arrow-down.png";
import Person from "./Person";

interface CalendarProps {
  t_user_id: number;
}

interface IReminder {
  reminder_ai_text: string;
  reminder_on_datetime: string;
  reminder_text: string;
}

const generateCalendar = (year: any, month: any) => {
  const result = [];

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);

  // Определяем день недели первого дня (сделаем так, чтобы понедельник был 0, воскресенье 6)
  const firstWeekDay = (firstDayOfMonth.getDay() + 6) % 7;

  // Сколько дней в текущем месяце
  const daysInMonth = lastDayOfMonth.getDate();

  // Сколько дней нужно взять из предыдущего месяца
  const prevMonthDays = firstWeekDay;

  // Получаем последний день предыдущего месяца
  const prevMonthLastDate = new Date(year, month, 0).getDate();

  // Генерируем даты для календаря
  const totalCells = 6 * 7;

  for (let i = 0; i < totalCells; i++) {
    const dayObj: any = {};

    if (i < prevMonthDays) {
      // Дни прошлого месяца
      dayObj.date = new Date(
        year,
        month - 1,
        prevMonthLastDate - prevMonthDays + i + 1
      );
      dayObj.currentMonth = false;
    } else if (i < prevMonthDays + daysInMonth) {
      // Дни текущего месяца
      dayObj.date = new Date(year, month, i - prevMonthDays + 1);
      dayObj.currentMonth = true;
    } else {
      // Дни следующего месяца
      dayObj.date = new Date(
        year,
        month + 1,
        i - (prevMonthDays + daysInMonth) + 1
      );
      dayObj.currentMonth = false;
    }

    result.push(dayObj);
  }

  return result;
};

const getLocalDateStr = (date: any) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const prepareTimeOnReminder = (str: string) => {
  let x = str.split(" ")[1];
  x = x.slice(0, 5);
  return <p key={str}>{x}</p>;
};

function formatDateToHuman(dateStr: string) {
  const months = [
    "января",
    "февраля",
    "марта",
    "апреля",
    "мая",
    "июня",
    "июля",
    "августа",
    "сентября",
    "октября",
    "ноября",
    "декабря",
  ];

  // @ts-ignore
  const [year, month, day] = dateStr.split("-").map(Number);
  const monthName = months[month - 1];

  return `${day} ${monthName}`;
}

const Calendar = ({ t_user_id }: CalendarProps) => {
  const today = new Date();

  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());

  const [reminders, setReminders] = useState<any>({});
  const [loading, setLoading] = useState(true);

  const [activeReminder, setActiveReminder] = useState<IReminder[]>([]);
  const [activeDay, setActiveDay] = useState<string>();

  const [selectedDate, setSelectedDate] = useState("");

  const [isCollapsed, setIsCollapsed] = useState(false);

  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjc0OTk5MTY5MCwiaWF0IjoxNzQ4MjYzODM0LCJleHAiOjE3Nzk3OTk4MzR9.bAYPe3BX0jnbH8kzS5STHcSwmR6kUiIQCXslT_v9aOo";

  useEffect(() => {
    const fetchReminders = async () => {
      try {
        const response = await fetch("https://bot-igor.ru/reminders", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ t_user_id }),
        });

        const data = await response.json();

        // console.log(data.reminders);

        // преобразуем в формат { "YYYY-MM-DD": [...] }
        const remindersByDate: any = {};

        for (const key in data.reminders) {
          const reminder = data.reminders[key];
          const dateStr = reminder.reminder_on_datetime.split(" ")[0];

          if (!remindersByDate[dateStr]) {
            remindersByDate[dateStr] = [];
          }

          remindersByDate[dateStr].push(reminder);
        }

        setReminders(remindersByDate);
        setLoading(false);
      } catch (error) {
        console.error("Ошибка при загрузке напоминаний:", error);
        setLoading(false);
      }
    };

    fetchReminders();
  }, [t_user_id]);

  useEffect(() => {
    const today = new Date();
    const todayStr = getLocalDateStr(today);

    setSelectedDate(todayStr);
    setActiveDay(formatDateToHuman(todayStr));
    setActiveReminder(reminders[todayStr] || []);
  }, [reminders]);

  const setCurrentInfoForToday = () => {
    const today = new Date();
    const todayStr = getLocalDateStr(today);
    setActiveDay(formatDateToHuman(todayStr));
    setSelectedDate(todayStr);
    setActiveReminder(reminders[todayStr] || []);
    setCurrentMonth(today.getMonth());
    setCurrentYear(today.getFullYear());
  };

  const calendarDays = generateCalendar(currentYear, currentMonth);

  const monthNames = [
    "Январь",
    "Февраль",
    "Март",
    "Апрель",
    "Май",
    "Июнь",
    "Июль",
    "Август",
    "Сентябрь",
    "Октябрь",
    "Ноябрь",
    "Декабрь",
  ];

  const weekDays = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

  const handlePrev = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((prev) => prev - 1);
    } else {
      setCurrentMonth((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((prev) => prev + 1);
    } else {
      setCurrentMonth((prev) => prev + 1);
    }
  };

  if (loading) {
    return <div>Загрузка...</div>;
  }

  // console.log(calendarDays);
  // console.log(reminders);

  return (
    <div className="content">
      <div
        className={`calendar-container ${
          isCollapsed ? "collapsed" : "expanded"
        }`}
      >
        <div className="calendar-header">
          <h2>
            {monthNames[currentMonth]} {currentYear}
          </h2>
          <div className="calendar-arrow-container">
            <Person />
            <div className="calendar-arrow">
              <div onClick={handlePrev}>
                <img src={arrowPrev} alt="arrow left" />
              </div>
              <div onClick={handleNext}>
                <img src={arrowNext} alt="arrow right" />
              </div>
              <p
                className="calendar-header-today"
                onClick={setCurrentInfoForToday}
              >
                Cегодня
              </p>
            </div>
          </div>
        </div>

        <div className="calendar-weekdays">
          {weekDays.map((day) => (
            <div key={day} className="weekday">
              {day}
            </div>
          ))}
        </div>

        <div className="calendar-grid">
          {calendarDays
            .filter((dayObj) => {
              if (!isCollapsed) return true;

              const selectedDateObj = new Date(selectedDate);

              const firstCalendarDate = calendarDays[0].date;

              const getWeekIndex = (date: any) => {
                const diffInDays = Math.floor(
                  (date - firstCalendarDate) / (1000 * 60 * 60 * 24)
                );
                return Math.floor(diffInDays / 7);
              };

              return (
                getWeekIndex(dayObj.date) === getWeekIndex(selectedDateObj)
              );
            })
            .map((dayObj, idx) => {
              // console.log(dayObj);
              //   const dateStr = dayObj.date.toISOString().split("T")[0];
              const dateStr = getLocalDateStr(dayObj.date);
              const hasReminders = reminders[dateStr];

              const handleDayClick = () => {
                setSelectedDate(dateStr);

                const clickedDate = new Date(dateStr);
                setCurrentMonth(clickedDate.getMonth());
                setCurrentYear(clickedDate.getFullYear());

                if (hasReminders) {
                  setActiveReminder(reminders[dateStr]);
                  setActiveDay(formatDateToHuman(dateStr));
                } else {
                  setActiveReminder([]);
                  setActiveDay(formatDateToHuman(dateStr));
                }
              };

              return (
                <div
                  key={idx}
                  onClick={handleDayClick}
                  className={`calendar-day ${
                    dayObj.currentMonth ? "" : "not-current"
                  } ${selectedDate === dateStr ? "active-day" : ""}`}
                >
                  <div>{dayObj.date.getDate()}</div>
                  {/* {hasReminders && <div className="reminder-indicator"></div>} */}
                  {hasReminders && (
                    <div
                      className={
                        dayObj.currentMonth
                          ? `reminder-indicator indicator${Math.min(
                              hasReminders.length,
                              8
                            )}`
                          : `reminder-indicator-not-current-month indicator${Math.min(
                              hasReminders.length,
                              8
                            )}`
                      }
                      // className={
                      //   dayObj.currentMonth
                      //     ? "reminder-indicator"
                      //     : "reminder-indicator-not-current-month"
                      // }
                    ></div>
                  )}
                </div>
              );
            })}
        </div>
        <div
          className="container-arrow-collapse"
          onClick={() => setIsCollapsed((prev) => !prev)}
        >
          {isCollapsed ? (
            <img
              className="arrow-down-collapse"
              src={arrowDown}
              alt="arrow down"
            />
          ) : (
            <img className="arrow-up-collapse" src={arrowDown} alt="arrow up" />
          )}
        </div>
      </div>
      <div className="reminder-container">
        <div className="reminder-active-day">{activeDay}</div>
        <div>{activeReminder.length ? "" : "Сегодня событий нет"}</div>
        {activeReminder &&
          activeReminder.map((reminder, index) => {
            return (
              <div key={index} className="reminder">
                <div className="reminder-separator"></div>
                <p>{reminder.reminder_ai_text}</p>
                {prepareTimeOnReminder(reminder.reminder_on_datetime)}
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default Calendar;

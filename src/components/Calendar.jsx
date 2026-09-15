import { useState } from "react";

function Calendar({ selectedDate, savedData, onDateClick }) {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());

  // 이전 달
  const handlePreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentYear((prev) => prev - 1);
      setCurrentMonth(11);
    } else {
      setCurrentMonth((prev) => prev - 1);
    }
  };

  // 다음 달
  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentYear((prev) => prev + 1);
      setCurrentMonth(0);
    } else {
      setCurrentMonth((prev) => prev + 1);
    }
  };

  // 해당 월의 마지막 날짜
  const lastDay = new Date(currentYear, currentMonth + 1, 0).getDate();

  // 해당 월 1일의 요일
  const startDay = new Date(currentYear, currentMonth, 1).getDay();

  const days = Array.from({ length: lastDay }, (_, index) => index + 1);

  return (
    <div className="calendar-card">
      <div className="calendar-header">
        <button type="button" onClick={handlePreviousMonth}>
          ‹
        </button>

        <h2>
          {currentYear}년 {currentMonth + 1}월
        </h2>

        <button type="button" onClick={handleNextMonth}>
          ›
        </button>
      </div>

      <div className="calendar-week">
        {["일", "월", "화", "수", "목", "금", "토"].map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>

      <div className="calendar-days">
        {/* 1일 전 빈칸 */}
        {Array.from({ length: startDay }).map((_, index) => (
          <div key={`empty-${index}`} className="empty-day" />
        ))}

        {days.map((day) => {
          const date = `${currentYear}-${String(currentMonth + 1).padStart(
            2,
            "0",
          )}-${String(day).padStart(2, "0")}`;

          const isSelected = selectedDate === date;

          const isSaved = savedData[date];

          return (
            <button
              key={day}
              type="button"
              className={`date ${isSelected ? "selected" : ""}`}
              onClick={() => onDateClick(date)}
            >
              <span>{day}</span>

              {isSaved && <small>저장됨</small>}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default Calendar;

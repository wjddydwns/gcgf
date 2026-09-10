function Calendar({ selectedDate, savedData, onDateClick }) {
  const days = Array.from({ length: 30 }, (_, i) => i + 1);

  // 2026년 9월 1일은 화요일
  const startDay = 2;

  return (
    <div className="card">
      <h2>날짜 선택</h2>

      <div className="calendar">

        <div className="calendar-header">
          <button>‹</button>

          <h3>2026년 9월</h3>

          <button>›</button>
        </div>

        {/* 요일 */}
        <div className="calendar-week">
          {["일", "월", "화", "수", "목", "금", "토"].map(
            (day) => (
              <div key={day}>{day}</div>
            )
          )}
        </div>

        {/* 날짜 */}
        <div className="calendar-days">

          {/* 빈칸 */}
          {Array.from({ length: startDay }).map(
            (_, index) => (
              <div key={`empty-${index}`} />
            )
          )}

          {days.map((day) => {
            const date = `2026-09-${String(day).padStart(
              2,
              "0"
            )}`;

            const isSelected = selectedDate === date;
            const isSaved = savedData[date];

            return (
              <button
                key={day}
                className={`date ${
                  isSelected ? "selected" : ""
                }`}
                onClick={() => onDateClick(date)}
              >
                <span>{day}</span>

                {isSaved && (
                  <small>
                    {isSaved.type === "individual"
                      ? "개인"
                      : "단체"}
                  </small>
                )}
              </button>
            );
          })}

        </div>
      </div>
    </div>
  );
}

export default Calendar;
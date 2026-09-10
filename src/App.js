import { useState } from "react";
import "./App.css";

function App() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [type, setType] = useState("individual");
  const [selectedPerson, setSelectedPerson] = useState(null);

  const people = {
    individual: [
      { id: 1, name: "김철수" },
      { id: 2, name: "이영희" },
      { id: 3, name: "박민수" },
      { id: 4, name: "최지훈" },
    ],
    group: [
      { id: 101, name: "개발팀" },
      { id: 102, name: "경영지원팀" },
      { id: 103, name: "인사팀" },
      { id: 104, name: "기획팀" },
    ],
  };

  const days = Array.from({ length: 30 }, (_, i) => i + 1);

  return (
    <div className="app">

      <div className="title">
        <h1>일정 선택</h1>
        <p>날짜와 대상자를 선택해주세요.</p>
      </div>

      <div className="content">

        {/* 달력 */}
        <div className="card">
          <h2>날짜 선택</h2>

          <div className="calendar">

            <h3>2026년 9월</h3>

            <div className="calendar-week">
              {["일", "월", "화", "수", "목", "금", "토"].map(
                (day) => (
                  <div key={day}>{day}</div>
                )
              )}
            </div>

            <div className="calendar-days">

              {/* 9월 1일이 화요일이므로 앞에 빈칸 2개 */}
              <div></div>
              <div></div>

              {days.map((day) => {
                const date = `2026-09-${String(day).padStart(
                  2,
                  "0"
                )}`;

                return (
                  <button
                    key={day}
                    className={
                      selectedDate === date
                        ? "date selected"
                        : "date"
                    }
                    onClick={() => {
                      setSelectedDate(date);
                      setSelectedPerson(null);
                    }}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* 사람 선택 */}
        <div className="card">

          <h2>대상자 선택</h2>

          <p>
            {selectedDate
              ? selectedDate
              : "먼저 날짜를 선택해주세요."}
          </p>

          <div className="tabs">

            <button
              className={
                type === "individual"
                  ? "tab active"
                  : "tab"
              }
              onClick={() => {
                setType("individual");
                setSelectedPerson(null);
              }}
            >
              개인
            </button>

            <button
              className={
                type === "group"
                  ? "tab active"
                  : "tab"
              }
              onClick={() => {
                setType("group");
                setSelectedPerson(null);
              }}
            >
              단체
            </button>

          </div>

          <div className="person-list">

            <div className="person-header">
              <div>
                {type === "individual" ? "이름" : "단체명"}
              </div>
              <div>선택</div>
            </div>

            {people[type].map((person) => {

              const isSelected =
                selectedPerson?.id === person.id;

              return (
                <div
                  key={person.id}
                  className={
                    isSelected
                      ? "person-row selected"
                      : "person-row"
                  }
                >
                  <div>{person.name}</div>

                  <div>
                    <button
                      className={
                        isSelected
                          ? "select-button selected"
                          : "select-button"
                      }
                      onClick={() =>
                        setSelectedPerson(person)
                      }
                    >
                      {isSelected ? "선택됨" : "선택"}
                    </button>
                  </div>
                </div>
              );
            })}

          </div>

        </div>
      </div>

      {/* 선택 결과 */}
      {selectedPerson && (
        <div className="result">

          <h2>선택 정보</h2>

          <div className="result-info">

            <div className="result-item">
              <span>날짜</span>
              {selectedDate}
            </div>

            <div className="result-item">
              <span>구분</span>
              {type === "individual" ? "개인" : "단체"}
            </div>

            <div className="result-item">
              <span>대상자</span>
              {selectedPerson.name}
            </div>

          </div>

          <button
            className="submit-button"
            onClick={() =>
              alert("선택이 완료되었습니다.")
            }
          >
            선택 완료
          </button>

        </div>
      )}

    </div>
  );
}

export default App;
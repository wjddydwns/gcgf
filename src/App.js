import { useState } from "react";

import Calendar from "./components/Calendar";
import PersonList from "./components/PersonList";
import SaveButtons from "./components/SaveButtons";

import "./App.css";

function App() {
  // 선택된 날짜
  const [selectedDate, setSelectedDate] = useState(null);

  // 체크된 사람
  const [checkedPeople, setCheckedPeople] = useState([]);

  // 날짜별 저장 데이터
  const [savedData, setSavedData] = useState({});

  // 사람 목록
  const people = [
    { id: 1, name: "김철수" },
    { id: 2, name: "이영희" },
    { id: 3, name: "박민수" },
    { id: 4, name: "최지훈" },
    { id: 5, name: "정수진" },
    { id: 6, name: "강민호" },
  ];

  // 날짜 선택
  const handleDateClick = (date) => {
    setSelectedDate(date);

    // 이미 저장된 날짜라면 체크 상태 복원
    if (savedData[date]) {
      setCheckedPeople(savedData[date].people);
    } else {
      setCheckedPeople([]);
    }
  };

  // 체크박스 선택
  const handleCheck = (id) => {
    setCheckedPeople((prev) => {
      if (prev.includes(id)) {
        return prev.filter(
          (personId) => personId !== id
        );
      }

      return [...prev, id];
    });
  };

  // 개인 / 단체 저장
  const handleSave = (type) => {
    if (!selectedDate) {
      alert("먼저 날짜를 선택해주세요.");
      return;
    }

    if (checkedPeople.length === 0) {
      alert("사람을 한 명 이상 선택해주세요.");
      return;
    }

    setSavedData((prev) => ({
      ...prev,

      [selectedDate]: {
        type,
        people: checkedPeople,
      },
    }));

    alert(
      `${type === "individual" ? "개인" : "단체"}으로 저장되었습니다.`
    );
  };

  return (
    <div className="app">

      {/* 제목 */}
      <div className="title">
        <h1>대상자 관리</h1>

        <p>
          날짜를 선택한 후 대상자를 선택해주세요.
        </p>
      </div>

      <div className="content">

        {/* 달력 */}
        <Calendar
          selectedDate={selectedDate}
          savedData={savedData}
          onDateClick={handleDateClick}
        />

        {/* 사람 목록 */}
        <div className="card">

          <h2>대상자 선택</h2>

          <p className="selected-date">
            {selectedDate
              ? selectedDate
              : "날짜를 먼저 선택해주세요."}
          </p>

          <PersonList
            people={people}
            checkedPeople={checkedPeople}
            selectedDate={selectedDate}
            onCheck={handleCheck}
          />

          <SaveButtons
            onSaveIndividual={() =>
              handleSave("individual")
            }
            onSaveGroup={() =>
              handleSave("group")
            }
          />

        </div>
      </div>

      {/* 저장 정보 */}
      {selectedDate && savedData[selectedDate] && (
        <div className="saved-card">

          <h2>저장된 정보</h2>

          <p>
            <strong>날짜</strong> : {selectedDate}
          </p>

          <p>
            <strong>구분</strong> :{" "}
            {savedData[selectedDate].type ===
            "individual"
              ? "개인"
              : "단체"}
          </p>

          <p>
            <strong>대상자</strong> :{" "}
            {savedData[selectedDate].people
              .map((id) => {
                const person = people.find(
                  (p) => p.id === id
                );

                return person?.name;
              })
              .join(", ")}
          </p>

        </div>
      )}

    </div>
  );
}

export default App;
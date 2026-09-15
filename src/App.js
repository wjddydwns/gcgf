import { useState } from "react";
import PeriodSelector from "./components/PeriodSelector";
import Calendar from "./components/Calendar";
import PersonList from "./components/PersonList";
import SaveButton from "./components/SaveButtons";
import { people, positionOrder } from "./data/employee";
import WordPreview from "./components/WordPreview";

import "./App.css";

function App() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [periodRecords, setPeriodRecords] = useState([]);
  const [checkedPeople, setCheckedPeople] = useState([]);

  // 날짜별 저장 목록
  const [savedData, setSavedData] = useState({});

  // 날짜 선택
  const handleDateClick = (date) => {
    setSelectedDate(date);

    // 날짜를 바꿀 때 체크박스 초기화
    setCheckedPeople([]);
  };

  // 사람 체크 / 해제
  const handleCheck = (id) => {
    setCheckedPeople((prev) => {
      if (prev.includes(id)) {
        return prev.filter((personId) => personId !== id);
      }

      return [...prev, id];
    });
  };

  // 직급 순으로 정렬
  const getSortedPeople = () => {
    return [...checkedPeople].sort((a, b) => {
      const personA = people.find((person) => person.id === a);

      const personB = people.find((person) => person.id === b);

      const positionA = positionOrder.indexOf(personA.position);

      const positionB = positionOrder.indexOf(personB.position);

      return positionA - positionB;
    });
  };

  // =========================
  // 개인 저장
  // =========================

  const handleSave = () => {
    if (!selectedDate) {
      alert("날짜를 먼저 선택해주세요.");
      return;
    }

    if (checkedPeople.length === 0) {
      alert("급식비 사용자를 선택해주세요.");
      return;
    }

    const newRecord = {
      type: "individual",
      people: [...checkedPeople],
    };

    setSavedData((prev) => ({
      ...prev,
      [selectedDate]: [...(prev[selectedDate] || []), newRecord],
    }));

    // 체크박스 초기화
    setCheckedPeople([]);

    // alert("저장되었습니다.");
  };

  // =========================
  // 단체 저장
  // =========================

  const handleGroupSave = () => {
    if (!selectedDate) {
      alert("날짜를 먼저 선택해주세요.");
      return;
    }

    if (checkedPeople.length === 0) {
      alert("급식비 사용자를 선택해주세요.");
      return;
    }

    const sortedPeople = getSortedPeople();

    const newRecord = {
      type: "group",
      people: sortedPeople,
    };

    setSavedData((prev) => ({
      ...prev,
      [selectedDate]: [...(prev[selectedDate] || []), newRecord],
    }));

    // 체크박스 초기화
    setCheckedPeople([]);

    // alert("단체로 저장되었습니다.");
  };

  // =========================
  // 저장 취소
  // =========================

  const handleCancel = (recordIndex) => {
    if (!selectedDate) {
      return;
    }

    const confirmed = window.confirm("이 저장 내용을 취소하시겠습니까?");

    if (!confirmed) {
      return;
    }

    setSavedData((prev) => {
      const newRecords = [...(prev[selectedDate] || [])];

      newRecords.splice(recordIndex, 1);

      const newData = {
        ...prev,
      };

      if (newRecords.length === 0) {
        delete newData[selectedDate];
      } else {
        newData[selectedDate] = newRecords;
      }

      return newData;
    });

    alert("저장이 취소되었습니다.");
  };

  // =========================
  // 날짜 표시
  // =========================

  const formatDate = (date) => {
    if (!date) {
      return "";
    }

    const [year, month, day] = date.split("-");

    const dateObject = new Date(Number(year), Number(month) - 1, Number(day));

    const weekdays = ["일", "월", "화", "수", "목", "금", "토"];

    return `${year}.${month}.${day}.(${weekdays[dateObject.getDay()]})`;
  };

  // 사람 이름을 한 줄로 표시
  const getPeopleText = (ids) => {
    return ids
      .map((id) => {
        const person = people.find((p) => p.id === id);

        return `${person.position} ${person.name}`;
      })
      .join(", ");
  };

  const currentSavedRecords =
    selectedDate && savedData[selectedDate] ? savedData[selectedDate] : [];

  return (
    <div className="app">
      <div className="title">
        <h1>급식비 관리</h1>

        <p>날짜를 선택하고 급식비 사용자를 선택해주세요.</p>
      </div>

      {/* 달력 */}
      <div className="calendar-wrapper">
        <Calendar
          selectedDate={selectedDate}
          savedData={savedData}
          onDateClick={handleDateClick}
        />
        <div>
          <PeriodSelector
            savedData={savedData}
            people={people}
            onSearchResult={setPeriodRecords}
          />
          {/* 사용자 선택 */}
          <div className="user-card">
            <div className="user-card-header">
              <div>
                <h2>급식비 사용자</h2>

                <p className="selected-date">
                  {selectedDate
                    ? formatDate(selectedDate)
                    : "날짜를 먼저 선택해주세요."}
                </p>
              </div>

              <div className="selected-count">
                {checkedPeople.length}명 선택
              </div>
            </div>

            <PersonList
              people={people}
              checkedPeople={checkedPeople}
              selectedDate={selectedDate}
              onCheck={handleCheck}
            />

            {/* 저장 버튼 */}
            <div className="button-area">
              <SaveButton onSave={handleSave} />

              <button
                type="button"
                className="group-save-button"
                onClick={handleGroupSave}
              >
                단체 저장
              </button>
            </div>
          </div>
        </div>
      </div>

      <WordPreview records={periodRecords} people={people} />

      {/* 저장된 정보 */}
      {/* {selectedDate && currentSavedRecords.length > 0 && (
        <div className="saved-card">
          <h2>저장된 정보</h2>

          <p>
            <strong>날짜:</strong> {formatDate(selectedDate)}
          </p>

          <div className="saved-records">
            {currentSavedRecords.map((record, index) => (
              <div key={index} className="saved-record">
                <div className="saved-record-content">
                  <span className="saved-record-type">
                    {record.type === "group" ? "단체" : "개인"}
                  </span>

                  <span className="saved-people-text">
                    {getPeopleText(record.people)}
                  </span>
                </div>

                <button
                  type="button"
                  className="cancel-button"
                  onClick={() => handleCancel(index)}
                >
                  저장 취소
                </button>
              </div>
            ))}
          </div>
        </div>
      )} */}
    </div>
  );
}

export default App;

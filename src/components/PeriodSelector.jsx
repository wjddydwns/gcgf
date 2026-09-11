import { useState } from "react";

function PeriodSelector({
  savedData,
  people,
  onSearchResult,
}) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [records, setRecords] = useState([]);

  // 날짜 표시
  const formatDate = (dateString) => {
    const [year, month, day] = dateString.split("-");

    const date = new Date(
      Number(year),
      Number(month) - 1,
      Number(day)
    );

    const weekdays = [
      "일",
      "월",
      "화",
      "수",
      "목",
      "금",
      "토",
    ];

    return `${year}.${month}.${day}.(${weekdays[date.getDay()]})`;
  };

  // 직원 이름 가져오기
  const getPeopleText = (ids) => {
    return ids
      .map((id) => {
        const person = people.find(
          (p) => p.id === id
        );

        return `${person.position} ${person.name}`;
      })
      .join(", ");
  };

  // 조회
  const handleSearch = () => {
    if (!startDate || !endDate) {
      alert("시작일과 종료일을 선택해주세요.");
      return;
    }

    if (startDate > endDate) {
      alert(
        "시작일이 종료일보다 늦을 수 없습니다."
      );
      return;
    }

    const result = [];

    Object.entries(savedData).forEach(
      ([date, dateRecords]) => {
        if (
          date >= startDate &&
          date <= endDate
        ) {
          dateRecords.forEach((record) => {
            result.push({
              date,
              ...record,
            });
          });
        }
      }
    );

    // 날짜순 정렬
    result.sort((a, b) =>
      a.date.localeCompare(b.date)
    );

    // PeriodSelector에서도 보여주기
    setRecords(result);

    // App.jsx에도 전달
    onSearchResult(result);
  };

  return (
    <div className="period-card">
      <h2>기간별 저장 정보</h2>

      <div className="period-selector">
        <input
          type="date"
          value={startDate}
          onChange={(e) =>
            setStartDate(e.target.value)
          }
        />

        <span>~</span>

        <input
          type="date"
          value={endDate}
          onChange={(e) =>
            setEndDate(e.target.value)
          }
        />

        <button
          type="button"
          onClick={handleSearch}
        >
          조회
        </button>
      </div>

      {records.length > 0 ? (
        <div className="period-records">
          {records.map((record, index) => (
            <div
              key={`${record.date}-${index}`}
              className="period-record"
            >
              <span>
                {formatDate(record.date)}
              </span>

              <span>
                {record.type === "group"
                  ? "단체"
                  : "개인"}
              </span>

              <span>
                {getPeopleText(record.people)}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <p>조회된 저장 정보가 없습니다.</p>
      )}
    </div>
  );
}

export default PeriodSelector;
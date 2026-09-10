function PersonList({
  people,
  checkedPeople,
  selectedDate,
  onCheck,
}) {
  return (
    <>
      <div className="person-list">

        <div className="person-header">
          <div>선택</div>
          <div>이름</div>
        </div>

        {people.map((person) => {
          const isChecked = checkedPeople.includes(
            person.id
          );

          return (
            <label
              key={person.id}
              className={`person-row ${
                isChecked ? "checked" : ""
              }`}
            >
              <div>
                <input
                  type="checkbox"
                  checked={isChecked}
                  disabled={!selectedDate}
                  onChange={() => onCheck(person.id)}
                />
              </div>

              <div className="person-name">
                {person.name}
              </div>
            </label>
          );
        })}

      </div>

      <div className="selected-count">
        {checkedPeople.length}명 선택
      </div>
    </>
  );
}

export default PersonList;
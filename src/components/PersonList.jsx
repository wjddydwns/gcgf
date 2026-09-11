function PersonList({
  people,
  checkedPeople,
  selectedDate,
  onCheck,
}) {
  const positions = [
    "계장",
    "대리",
    "과장",
    "차장",
    "팀장",
    "부장",
  ];

  return (
    <div className="person-groups">
      {positions.map((position) => {
        const positionPeople = people.filter(
          (person) =>
            person.position === position
        );

        return (
          <details
            key={position}
            className="person-group"
            open
          >
            <summary>
              <span>{position}</span>

              <span className="person-count">
                {positionPeople.length}명
              </span>
            </summary>

            <div className="person-group-list">
              {positionPeople.map((person) => {
                const isChecked =
                  checkedPeople.includes(
                    person.id
                  );

                return (
                  <label
                    key={person.id}
                    className={`person-row ${
                      isChecked
                        ? "checked"
                        : ""
                    } ${
                      !selectedDate
                        ? "disabled"
                        : ""
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      disabled={!selectedDate}
                      onChange={() =>
                        onCheck(person.id)
                      }
                    />

                    <span>{person.name}</span>
                  </label>
                );
              })}
            </div>
          </details>
        );
      })}
    </div>
  );
}

export default PersonList;
function SaveButtons({
  onSaveIndividual,
  onSaveGroup,
}) {
  return (
    <div className="save-buttons">

      <button
        className="individual-button"
        onClick={onSaveIndividual}
      >
        개인으로 저장
      </button>

      <button
        className="group-button"
        onClick={onSaveGroup}
      >
        단체로 저장
      </button>

    </div>
  );
}

export default SaveButtons;
function SaveButton({ onSave }) {
  return (
    <button
      type="button"
      className="save-button"
      onClick={onSave}
    >
      저장
    </button>
  );
}

export default SaveButton;
import "./FormsPopup.css";

function FormsPopup({ title, children, onClose }) {
  return (
    <div id="course-popup" className="course-popup">
      <div className="course-popup-content">
        <div className="course-popup-header">
          <h2>{title}</h2>
          <button className="close-button" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="course-popup-body">{children}</div>
      </div>
    </div>
  );
}

export default FormsPopup;
import "./Popup.css";

function Popup({ title, message, onClose }) {
  return (
    <div className="popup-overlay">
      <div className="popup-container">
        <button className="popup-close" onClick={onClose}>
          ✖
        </button>
        <h2 className="popup-title">{title}</h2>
        <p className="popup-message">{message}</p>
      </div>
    </div>
  );
}

export default Popup;
import "./Button.css";

function Button({ title, onClick, color }) {
  const buttonColor =
    color === "red"
      ? "#a80000"
      : color === "green"
      ? "#008000"
      : color === "yellow"
      ? "#FFA500"
      : "#0C4DA2"; // Cor padrão (azul)

  return (
    <button
      className="button-template"
      onClick={onClick}
      style={{ backgroundColor: buttonColor, borderColor: buttonColor }}
    >
      {title}
    </button>
  );
}

export default Button;
import "./ButtonTransparent.css";

function ButtonTransparent({ title, onClick }) {

  return (
    <button className="button-transparent-template" onClick={onClick}>
      {title}
    </button>
  );
}


export default ButtonTransparent;
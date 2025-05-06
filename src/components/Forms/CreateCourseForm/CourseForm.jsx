import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import "./CourseForm.css";

function CourseForm({ apiUrl, onSuccess, editingCourse }) {
  const [nome, setNome] = useState(editingCourse ? editingCourse.nome : "");
  const [categoriaId, setCategoriaId] = useState(
    editingCourse ? editingCourse.categoriaId : ""
  );
  const [categorias, setCategorias] = useState([]);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await fetch(`${apiUrl}/courses/categories`);
        if (!response.ok) {
          throw new Error("Erro ao buscar categorias.");
        }
        const data = await response.json();
        setCategorias(data);
      } catch (error) {
        setError("Erro ao carregar categorias.");
      }
    };

    fetchCategorias();
  }, [apiUrl]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    const token = Cookies.get("jwtToken");

    if (!token) {
      setError("Você precisa estar autenticado para criar ou editar um curso.");
      return;
    }

    try {
      const method = editingCourse ? "PATCH" : "POST";
      const url = editingCourse
        ? `${apiUrl}/courses/${editingCourse.cursoId}`
        : `${apiUrl}/courses`;

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ nome, categoriaId: parseInt(categoriaId) }),
      });

      if (!response.ok) {
        throw new Error(
          editingCourse ? "Erro ao editar o curso." : "Erro ao criar o curso."
        );
      }

      setSuccessMessage(
        editingCourse ? "Curso editado com sucesso!" : "Curso criado com sucesso!"
      );
      setNome("");
      setCategoriaId("");
      if (onSuccess) onSuccess();
    } catch (error) {
      setError(
        editingCourse ? "Erro ao editar o curso." : "Erro ao criar o curso."
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="create-course-form">
      {error && <p className="error-message">{error}</p>}
      {successMessage && <p className="success-message">{successMessage}</p>}
      <div className="form-group">
        <label htmlFor="nome">Nome do Curso:</label>
        <input
          type="text"
          id="nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Digite o nome do curso"
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="categoria">Categoria:</label>
        <select
          id="categoria"
          value={categoriaId}
          onChange={(e) => setCategoriaId(e.target.value)}
          required
        >
          <option value="">Selecione uma categoria</option>
          {categorias.map((categoria, index) => (
            <option key={index} value={index + 1}>
              {categoria}
            </option>
          ))}
        </select>
      </div>
      <button type="submit" className="button-template">
        {editingCourse ? "Salvar Alterações" : "Criar Curso"}
      </button>
    </form>
  );
}

export default CourseForm;
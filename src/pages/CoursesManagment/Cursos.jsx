import { useState, useEffect } from "react";
import Cookies from "js-cookie"; // Para obter o token de autenticação
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import CourseForm from "../../components/Forms/CreateCourseForm/CourseForm";
import CoursePopup from "../../components/Popup/FormsPopup/FormsPopup";
import Button from "../../components/Button/Button";
import "./Cursos.css";

function Cursos() {
  const [courses, setCourses] = useState([]);
  const [showPopup, setShowPopup] = useState(false); // Controla a exibição do popup para criar/editar
  const [showDeletePopup, setShowDeletePopup] = useState(false); // Controla o popup de exclusão
  const [editingCourse, setEditingCourse] = useState(null); // Estado para curso em edição
  const [courseToDelete, setCourseToDelete] = useState(null); // Curso a ser excluído
  const [confirmDelete, setConfirmDelete] = useState(false); // Estado da checkbox de confirmação
  const [deleteError, setDeleteError] = useState(null); // Mensagem de erro ao excluir
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  const fetchCourses = async () => {
    try {
      const response = await fetch(`${apiUrl}/courses`);
      if (!response.ok) {
        throw new Error("Erro ao buscar os cursos.");
      }
      const data = await response.json();
      setCourses(data);
    } catch (error) {
      console.error("Erro ao carregar os cursos:", error);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [apiUrl]);

  const handleEdit = (course) => {
    setEditingCourse(course); // Define o curso em edição
    setShowPopup(true);
  };

  const handleDelete = (course) => {
    setCourseToDelete(course); // Define o curso a ser excluído
    setConfirmDelete(false); // Reseta a checkbox
    setDeleteError(null); // Reseta a mensagem de erro
    setShowDeletePopup(true);
  };

  const confirmDeleteCourse = async () => {
    if (!confirmDelete) {
      setDeleteError("Você deve confirmar que deseja excluir este curso.");
      return;
    }

    const token = Cookies.get("jwtToken"); // Obtém o token de autenticação
    if (!token) {
      setDeleteError("Você precisa estar autenticado para excluir um curso.");
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/courses/${courseToDelete.cursoId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`, // Adiciona o token no cabeçalho
        },
      });

      if (response.status === 400) {
        setDeleteError("Não é possível excluir o curso. Usuários vinculados.");
        return;
      }

      if (!response.ok) {
        throw new Error("Erro ao excluir o curso.");
      }

      setCourses((prevCourses) =>
        prevCourses.filter((course) => course.cursoId !== courseToDelete.cursoId)
      );
      setShowDeletePopup(false);
      console.log("Curso excluído com sucesso!");
    } catch (error) {
      setDeleteError("Erro ao excluir o curso.");
    }
  };

  const handleCreate = () => {
    setEditingCourse(null); // Reseta o estado de edição
    setShowPopup(true);
  };

  return (
    <>
      <Header />
      <main className="courses-container">
        <h1>Gestão de Cursos</h1>
        <div id="button-container-criar">
          <Button title="Criar Curso" onClick={handleCreate} />
        </div>
        <table className="courses-table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Categoria</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr key={course.cursoId}>
                <td>{course.nome}</td>
                <td>{course.categoria}</td>
                <td className="actions-column">
                  <Button title="Editar" onClick={() => handleEdit(course)} />
                    
                  <Button title="Excluir" onClick={() => handleDelete(course)} color="red"/>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
      <Footer />

      {showPopup && (
        <CoursePopup
          title={editingCourse ? "Editar Curso" : "Criar Curso"}
          onClose={() => setShowPopup(false)}
        >
          <CourseForm
            apiUrl={apiUrl}
            onSuccess={() => {
              fetchCourses();
              setShowPopup(false);
            }}
            editingCourse={editingCourse} // Passa o curso em edição (se houver)
          />
        </CoursePopup>
      )}

      {showDeletePopup && (
        <CoursePopup
          title="Excluir Curso"
          onClose={() => setShowDeletePopup(false)}
        >
          <p>Tem certeza que deseja excluir o curso "{courseToDelete.nome}"?</p>
          <div className="checkbox-container">
            <input
              type="checkbox"
              id="confirm-delete-checkbox"
              checked={confirmDelete}
              onChange={(e) => setConfirmDelete(e.target.checked)}
            />
            <label htmlFor="confirm-delete-checkbox">
              Você tem certeza? que deseja excluir?
            </label>
          </div>
          {deleteError && <p className="error-message">{deleteError}</p>}
          <div className="modal-actions">
            <Button title="Confirmar" onClick={confirmDeleteCourse} color="green"/>
            <Button title="Cancelar" onClick={() => setShowDeletePopup(false)} color="red"/>
          </div>
        </CoursePopup>
      )}
    </>
  );
}

export default Cursos;
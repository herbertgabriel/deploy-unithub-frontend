import { useState, useEffect } from "react";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import Cookies from "js-cookie";
import FormsPopup from "../../components/Popup/FormsPopup/FormsPopup";
import "./GerenciamentoUsuarios.css";
import Button from "../../components/Button/Button";

function GerenciamentoUsuarios() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [selectedRole, setSelectedRole] = useState("3"); // Role selecionada
  const [showRolePopup, setShowRolePopup] = useState(false); // Controla o popup de alteração de role
  const [showDeletePopup, setShowDeletePopup] = useState(false); // Controla o popup de exclusão
  const [currentUser, setCurrentUser] = useState(null); // Usuário atual para alteração ou exclusão
  const [confirmDelete, setConfirmDelete] = useState(false); // Estado da checkbox de confirmação
  const [popupError, setPopupError] = useState(null); // Mensagem de erro no popup
  const [selectedNewRole, setSelectedNewRole] = useState(""); // Nova role selecionada
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  const fetchUsersByRole = async (roleId) => {
    const token = Cookies.get("jwtToken");
    if (!token) {
      setError("Você precisa estar autenticado para visualizar os usuários.");
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/users/role/${roleId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Erro ao buscar os usuários.");
      }

      const data = await response.json();
      setUsers(data);
      setError(null);
    } catch (error) {
      setError("Erro ao carregar os usuários.");
    }
  };

  useEffect(() => {
    fetchUsersByRole(selectedRole);
  }, [selectedRole, apiUrl]);

  const handleOpenRolePopup = (user) => {
    setCurrentUser(user);
    setPopupError(null);
    setSelectedNewRole(""); // Reseta a role selecionada
    setShowRolePopup(true);
  };

  const handleChangeRole = async () => {
    if (!selectedNewRole) {
      setPopupError("Você deve selecionar uma nova role.");
      return;
    }

    const token = Cookies.get("jwtToken");
    if (!token) {
      setPopupError("Você precisa estar autenticado para alterar a role.");
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/users/change-role`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId: currentUser.UserId, roleId: parseInt(selectedNewRole) }),
      });

      if (!response.ok) {
        throw new Error("Erro ao alterar a role do usuário.");
      }

      setShowRolePopup(false);
      fetchUsersByRole(selectedRole);
    } catch (error) {
      setPopupError("Erro ao alterar a role do usuário.");
    }
  };
  const handleOpenDeletePopup = (user) => {
    setCurrentUser(user);
    setConfirmDelete(false);
    setPopupError(null);
    setShowDeletePopup(true);
  };

  const handleDeleteUser = async () => {
    if (!confirmDelete) {
      setPopupError("Você deve confirmar que deseja excluir este usuário.");
      return;
    }

    const token = Cookies.get("jwtToken");
    if (!token) {
      setPopupError("Você precisa estar autenticado para deletar um usuário.");
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/users/${currentUser.UserId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Erro ao deletar o usuário.");
      }

      setShowDeletePopup(false);
      setUsers((prevUsers) =>
        prevUsers.filter((user) => user.UserId !== currentUser.UserId)
      );
    } catch (error) {
      setPopupError("Erro ao deletar o usuário.");
    }
  };

  return (
    <>
      <Header />
      <main className="user-management-container">
        <h1>Gerenciamento de Usuários</h1>
        {error && <p className="error-message">{error}</p>}

        {/* Select para filtrar usuários por role */}
        <div className="filter-container">
          <label htmlFor="role-filter">Filtrar por Role:</label>
          <select
            id="role-filter"
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
          >
                        {Cookies.get("userRole") !== "ORGANIZADOR" && (
              <option value="2">Organizador</option>
            )}
            <option value="3">Aluno</option>
            <option value="4">Aluno Representante</option>
          </select>
        </div>

        <table className="user-table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Email</th>
              <th>Telefone</th>
              {selectedRole !== "2" && (
              <th>Curso</th>
              )}
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.UserId}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.telephone || "N/A"}</td>
                {selectedRole !== "2" && (
                <td>{user.course || "N/A"}</td>
              )}
                {user.role !== "ADMIN" && (
                <td>
                  <div className="actions">
                    {/* Remove os botões para usuários com role "Admin" */}
                    
                      <>
                        <Button title="Alterar Função" onClick={() => handleOpenRolePopup(user)} color="yellow"/> 
                        {Cookies.get("userRole") !== "ORGANIZADOR" && (
                          
                          <Button title="Deletar" onClick={() => handleOpenDeletePopup(user)} color="red"/> 
                        )}
                        
                      </>
                    
                  </div>
                </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </main>
      <Footer />

      {/* Popup para Alterar Role */}
      {showRolePopup && (
        <FormsPopup
          title={`Alterar Role de ${currentUser.name}`}
          onClose={() => setShowRolePopup(false)}
        >
          {popupError && <p className="error-message">{popupError}</p>}
          <select
            onChange={(e) => setSelectedNewRole(e.target.value)}
            defaultValue=""
          >
            <option value="" disabled>
              Selecione uma nova role
            </option>
            {/* Oculta a role "Organizador" se o usuário atual for Organizador */}
            {Cookies.get("userRole") !== "ORGANIZADOR" && (
              <option value="2">Organizador</option>
            )}
            <option value="3">Aluno</option>
            <option value="4">Aluno Representante</option>
          </select>
          <Button title="Confirmar" onClick={handleChangeRole} color="green"/>
        </FormsPopup>
      )}

      {/* Popup para Deletar Usuário */}
      {showDeletePopup && (
        <FormsPopup
          title={`Excluir Usuário ${currentUser.name}`}
          onClose={() => setShowDeletePopup(false)}
        >
          {popupError && <p className="error-message">{popupError}</p>}
          <p>Tem certeza que deseja excluir este usuário?</p>
          <div className="checkbox-container">
            <input
              type="checkbox"
              id="confirm-delete-checkbox"
              checked={confirmDelete}
              onChange={(e) => setConfirmDelete(e.target.checked)}
            />
            <label htmlFor="confirm-delete-checkbox">
              Confirmo que desejo excluir este usuário.
            </label>
          </div>
          <Button title="Confirmar"  onClick={handleDeleteUser} color="green"/>
        </FormsPopup>
      )}
    </>
  );
}

export default GerenciamentoUsuarios;
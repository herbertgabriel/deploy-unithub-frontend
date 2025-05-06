import { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const token = Cookies.get("jwtToken");
    const role = Cookies.get("userRole");

    if (token && role) {
      setIsAuthenticated(true);
      setUserRole(role);
    } else {
      console.warn("Token JWT ou role não encontrados nos cookies.");
      setIsAuthenticated(false);
      setUserRole(null);
    }
  }, []);

  const login = (token, role, expiresIn) => {
    if (!token || !role) {
      console.error("Token ou role inválidos fornecidos no login.");
      return;
    }

    const expirationDate = new Date();
    expirationDate.setSeconds(expirationDate.getSeconds() + expiresIn);

    Cookies.set("jwtToken", token, { expires: expirationDate });
    Cookies.set("userRole", role, { expires: expirationDate });
    setIsAuthenticated(true);
    setUserRole(role);
  };

  const logout = () => {
    Cookies.remove("jwtToken");
    Cookies.remove("userRole");
    setIsAuthenticated(false);
    setUserRole(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userRole, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
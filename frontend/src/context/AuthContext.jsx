import { createContext, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router";
import { LoginUser, RegisterUser } from "@services";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userToken, setUserToken] = useState(null);
  const navigate = useNavigate();

  const BACKEND_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const storedToken = localStorage.getItem("token");

    if (storedToken) {
      setUserToken(storedToken);

      fetch(`${BACKEND_URL}/auth/verify-token`, {
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      })
        .then((res) => {
          if (!res.ok) throw new Error("Token inválido");
          return res.json();
        })
        .then((data) => {
          setUser(data.user);
        })
        .catch((err) => {
          console.error("Error al verificar token:", err);
          logout();
          window.location.href = "/login";
        });
    }
  }, []);

  const login = (email, password, onSuccess, onError) => {
    LoginUser(email, password)
      .then((data) => {
        if (data.token) {
          localStorage.setItem("token", data.token);
          setUserToken(data.token);

          fetch(`${BACKEND_URL}/auth/verify-token`, {
            headers: {
              Authorization: `Bearer ${data.token}`,
            },
          })
            .then((res) => {
              if (!res.ok) throw new Error("Token inválido");
              return res.json();
            })
            .then((res) => {
              setUser(res.user);
              if (onSuccess) onSuccess();
            });
        } else {
          if (onError) onError("Credenciales incorrectas");
        }
      })
      .catch((err) => {
        console.error("Error en login:", err);
        if (onError) onError("Error al iniciar sesión");
      });
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setUserToken(null);
  };

  const register = (firstname, lastname, email, password) => {
    return RegisterUser(firstname, lastname, email, password)
      .then((user) => {
        navigate("/login");
      });
  };

  return (
    <AuthContext.Provider value={{ login, logout, user, userToken, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

import { createContext, useState, useEffect, useContext } from "react";
import { LoginUser, RegisterUser } from "@services";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";

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

  const login = (email, password) => {
    const loadingToast = toast.loading("Iniciando sesión...");

    LoginUser(email, password)
      .then((data) => {
        if (!data.token) {
          toast.error("Credenciales incorrectas", { id: loadingToast });
          return;
        }

        localStorage.setItem("token", data.token);
        setUserToken(data.token);

        return fetch(`${BACKEND_URL}/auth/verify-token`, {
          headers: {
            Authorization: `Bearer ${data.token}`,
          },
        });
      })
      .then((res) => {
        if (!res?.ok) throw new Error("Token inválido");
        return res.json();
      })
      .then((res) => {
        setUser(res.user);
        toast.success("Sesión iniciada con éxito", { id: loadingToast });
        navigate("/dashboard");
      })
      .catch((err) => {
        console.error("Error en login:", err);
        toast.error("Error al iniciar sesión", { id: loadingToast });
      });
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setUserToken(null);
    toast.success("Sesión cerrada correctamente");
  };

  const register = (firstname, lastname, email, password) => {
    const loadingToast = toast.loading("Creando cuenta...");

    return RegisterUser(firstname, lastname, email, password)
      .then(() => {
        toast.success("Cuenta creada con éxito", { id: loadingToast });
        navigate("/login");
      })
      .catch((err) => {
        console.error("Error en el registro:", err);
        toast.error("Error al crear la cuenta", { id: loadingToast });
      });
  };

  return (
    <AuthContext.Provider
      value={{ login, logout, user, userToken, register, setUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

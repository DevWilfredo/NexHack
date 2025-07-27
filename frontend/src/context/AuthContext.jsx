import { createContext, useState, useEffect, useContext } from "react";
import { LoginUser, RegisterUser, getUserNotifications } from "@services";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userToken, setUserToken] = useState(null);
  const navigate = useNavigate();

  const BACKEND_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const storedToken = sessionStorage.getItem("token");

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
        .then(async (data) => {
          try {
            const notifications = await getUserNotifications(storedToken);
            setUser({ ...data.user, notifications });
          } catch (error) {
            console.error("Error cargando notificaciones:", error);
            setUser(data.user); // fallback sin notificaciones
          }
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
      if (data.token) {
        sessionStorage.setItem("token", data.token);
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
          .then(async (res) => {
            try {
              const notifications = await getUserNotifications(data.token);
              setUser({ ...res.user, notifications });
              toast.success("Sesión iniciada con éxito", { id: loadingToast });
              navigate("/dashboard");
            } catch (error) {
              console.error("Error al obtener notificaciones:", error);
              setUser(res.user);
              toast.success("Sesión iniciada con éxito", { id: loadingToast });
              navigate("/dashboard");
            }
          })
          .catch((err) => {
            console.error("Error al verificar token:", err);
            toast.error("Token inválido", { id: loadingToast });
          });
      } else {
        toast.error("Credenciales incorrectas", { id: loadingToast });
      }
    })
    .catch((err) => {
      console.error("Error en login:", err);
      toast.error("Error al iniciar sesión", { id: loadingToast });
    });
};



  const logout = () => {
    sessionStorage.removeItem("token");
    setUser(null);
    setUserToken(null);
    toast.success("Sesión cerrada correctamente");
  };

  const register = (firstname, lastname, email, password) => {
    const loadingToast = toast.loading("Creando cuenta...");

    return RegisterUser(firstname, lastname, email, password)
      .then((user) => {
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

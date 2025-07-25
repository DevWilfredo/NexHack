import React, { createContext, useContext, useEffect, useState } from "react";
import { getUsers } from "@services"; // ajusta la ruta
import { useAuth } from "./AuthContext"; // si usas auth para el token

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [globalUsers, setGlobalUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const { userToken } = useAuth(); 

  const fetchUsers = async () => {
    if (!userToken) return;
    setLoadingUsers(true);
    const users = await getUsers(userToken);
    if (users) setGlobalUsers(users);
    setLoadingUsers(false);
  };

  useEffect(() => {
    fetchUsers();
  }, [userToken]);

  return (
    <AppContext.Provider
      value={{ globalUsers, setGlobalUsers, loadingUsers, fetchUsers }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);

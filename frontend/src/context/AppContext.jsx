import React, { createContext, useContext, useEffect, useState } from "react";
import { getUsers, getMyHackathons } from "@services"; // ajusta la ruta si hace falta
import { useAuth } from "./AuthContext"; // si usas auth para el token

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [globalUsers, setGlobalUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  const [myHackathons, setMyHackathons] = useState([]);
  const [loadingHackathons, setLoadingHackathons] = useState(false);

  const { userToken } = useAuth(); 

  const fetchUsers = async () => {
    if (!userToken) return;
    setLoadingUsers(true);
    const users = await getUsers(userToken);
    if (users) setGlobalUsers(users);
    setLoadingUsers(false);
  };

  const fetchMyHackathons = async () => {
    if (!userToken) return;
    setLoadingHackathons(true);
    const data = await getMyHackathons(userToken);
    if (data) setMyHackathons(data);
    setLoadingHackathons(false);
  };

  useEffect(() => {
    fetchUsers();
    fetchMyHackathons();
  }, [userToken]);

  return (
    <AppContext.Provider
      value={{
        globalUsers,
        setGlobalUsers,
        loadingUsers,
        fetchUsers,
        myHackathons,
        fetchMyHackathons,
        loadingHackathons,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);

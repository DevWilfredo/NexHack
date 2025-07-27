import React, { createContext, useContext, useEffect, useState } from "react";
import {
  getUsers,
  getMyHackathons,
  fetchUserRequests,
  HandleInvitation,
} from "@services";
import { useAuth } from "./AuthContext";
import { GetHackathons } from "../services";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [globalUsers, setGlobalUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  const [myHackathons, setMyHackathons] = useState([]);
  const [loadingHackathons, setLoadingHackathons] = useState(false);

  const [requests, setRequests] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(false);

  const [allHackathons, setAllHackathons] = useState([]);
  const [loadingAllHackathons, setLoadingAllHackathons] = useState(false);

  const { userToken } = useAuth();

  const fetchUsers = async () => {
    if (!userToken) return;
    setLoadingUsers(true);
    const users = await getUsers(userToken);
    if (users) setGlobalUsers(users);
    setLoadingUsers(false);
  };

  const fetchMyHackathons = async () => {
    setLoadingHackathons(true);
    const data = await getMyHackathons(userToken);
    if (data) setMyHackathons(data);
    setLoadingHackathons(false);
  };

  const fetchRequests = async () => {
    if (!userToken) return;
    setLoadingRequests(true);
    const data = await fetchUserRequests(userToken);
    if (data) setRequests(data);
    console.log("Requests fetched:", data);
    setLoadingRequests(false);
  };

  const fetchAllHackathons = async () => {
    if (!userToken) return;
    setLoadingAllHackathons(true);
    const data = await GetHackathons(userToken);
    if (data) setAllHackathons(data);
    console.log("all hackathons fetched:", data);
    setLoadingAllHackathons(false);
  };

  const handleInvitation = async (requestID, action) => {
    if (!userToken) return;
    try {
      const result = await HandleInvitation(userToken, requestID, action);
      await fetchRequests();
      return result;
    } catch (error) {
      console.error("Error al manejar invitación:", error);
      throw error;
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchMyHackathons();
    fetchRequests();
    fetchAllHackathons();
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
        requests,
        fetchRequests,
        loadingRequests,
        handleInvitation,
        allHackathons,
        fetchAllHackathons,
        loadingAllHackathons,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);

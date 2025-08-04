import React, { createContext, useContext, useEffect, useState } from "react";
import {
  getUsers,
  getMyHackathons,
  fetchUserRequests,
  HandleInvitation,
} from "@services";
import { useAuth } from "./AuthContext";
import { GetAllWinners, GetHackathons, GetScores } from "../services";

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

  const [allScores, setScores] = useState([]);
  const [loadingScores, setLoadingScores] = useState(false);

  const [allWinners, setAllWinners] = useState([]);
  const [loadingWinners, setLoadingWinners] = useState(false);

  const { userToken, user } = useAuth();

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
    setLoadingRequests(false);
  };

  const fetchAllHackathons = async () => {
    if (!userToken) return;
    setLoadingAllHackathons(true);
    const data = await GetHackathons(userToken);
    if (data) setAllHackathons(data);
    setLoadingAllHackathons(false);
  };

  const fetchScores = async () => {
    if (!userToken) return;
    setLoadingScores(true);
    const data = await GetScores(userToken);
    if (data) setScores(data);
    setLoadingScores(false);
  };

  const fetchAllWinners = async () => {
    if (!userToken) return;
    setLoadingWinners(true);
    const data = await GetAllWinners(userToken);
    if (data) setAllWinners(data);
    setLoadingWinners(false);
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
    fetchScores();
    fetchAllWinners();
  }, [userToken, user]);

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
        allScores,
        fetchScores,
        loadingScores,
        allWinners,
        fetchAllWinners,
        loadingWinners,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);

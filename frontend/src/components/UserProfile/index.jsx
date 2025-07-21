import { HeartPlus, ThumbsUp } from "lucide-react";
import React, { useEffect, useState } from "react";
import ChartComponent from "@components/chartComponent";
import { useAuth } from "@context/AuthContext";
import { GetUserProfile } from "@services/";
import ModalUserUpdateComponent from "../ModalUserUpdate";

function UserProfileComponent() {
  const { user, userToken, setUser } = useAuth();
  const [userInfo, setUserInfo] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [userLoaded, setUserLoaded] = useState(false);

  const handleModal = () => setShowModal((prev) => !prev);

  const handleUpdate = (updatedData) => {
    setUser(updatedData);
  };

  //info Hardcodeada porque falta informacion en la db
  const [activeTab, setActiveTab] = useState("global");

  const [repos, setRepos] = useState([
    { name: "React no IA", description: "72hrs project without copilot." },
    {
      name: "Angular Express",
      description: "24 hours all around SAAS with Angular",
    },
    {
      name: "Solo dev React",
      description: "1 week whole project no teams allowed",
    },
  ]);

  const [followers, setFollowers] = useState([
    { username: "devAlice" },
    { username: "devBob" },
  ]);

  const [hacksWins, sethacksWins] = useState([
    { hackname: "Angular solodev", timeLimit: "24 hours", ranked: "1st place" },
    { hackname: "devDiana", timeLimit: "48 hours", ranked: "2nd place" },
  ]);

  return (
    <div className="flex justify-center">
      <div className="basis-64 items-center gap-4">
        <img
          src={
            user.profile_picture
              ? `${import.meta.env.VITE_API_URL}/users/profile_pictures/${
                  user.profile_picture
                }`
              : `https://placehold.co/400x400?text=${
                  user.firstname?.charAt(0)?.toUpperCase() || "U"
                }`
          }
          alt="Avatar"
          className="w-24 h-24 rounded-full"
        />

        <div>
          <h1 className="text-2xl font-bold">
            {`${user.firstname} ${user.lastname}`}
          </h1>

          <p className="text-sm text-gray-500">@{userInfo.username}</p>
          <button
            className="btn btn-sm mt-2 btn-outline ml-auto"
            onClick={handleModal}
          >
            Edit Profile
          </button>
          <p className="mt-2">{userInfo.bio}</p>
        </div>
        {/* Seguidores y seguidos */}
        <div className="mt-4 flex gap-6">
          <span>
            <HeartPlus className="text-accent" />
            {userInfo.followers}
            Followers
          </span>
          <span>
            <ThumbsUp className="text-success" />
            {userInfo.following}
            Likes
          </span>
        </div>
      </div>

      {/* Tabs + Content dentro de un solo div */}
      <div className="mt-6 basis-256 space-y-4">
        {/* Tabs */}
        <div className="flex gap-4 border-b pb-2">
          <button
            className={`btn btn-ghost ${
              activeTab === "global" ? "btn-active" : ""
            }`}
            onClick={() => setActiveTab("global")}
          >
            Global Position
          </button>
          <button
            className={`btn btn-ghost ${
              activeTab === "repos" ? "btn-active" : ""
            }`}
            onClick={() => setActiveTab("repos")}
          >
            Hackathones
          </button>
          <button
            className={`btn btn-ghost ${
              activeTab === "followers" ? "btn-active" : ""
            }`}
            onClick={() => setActiveTab("followers")}
          >
            Followers
          </button>
          <button
            className={`btn btn-ghost ${
              activeTab === "hacksWins" ? "btn-active" : ""
            }`}
            onClick={() => setActiveTab("hacksWins")}
          >
            Ranked places
          </button>
        </div>

        {/* Contenido dinámico */}
        <div>
          {activeTab === "repos" && (
            <ul className="space-y-4">
              {repos.map((repo, index) => (
                <li key={index} className="p-4 border rounded-box">
                  <h2 className="font-semibold">{repo.name}</h2>
                  <p className="text-sm">{repo.description}</p>
                </li>
              ))}
            </ul>
          )}

          {activeTab === "global" && <ChartComponent />}

          {activeTab === "followers" && (
            <ul className="space-y-2">
              {followers.map((f, i) => (
                <li key={i} className="p-2 border rounded-box">
                  @{f.username}
                </li>
              ))}
            </ul>
          )}

          {activeTab === "hacksWins" && (
            <ul className="space-y-2">
              {hacksWins.map((f, i) => (
                <div key={i} className="p-2 border rounded-box ps-5">
                  <h2 className="font-semibold">{f.hackname}</h2>
                  <p className="text-sm">
                    Time Limit: {f.timeLimit} - Ranked: {f.ranked}
                  </p>
                </div>
              ))}
            </ul>
          )}
        </div>
      </div>

      <ModalUserUpdateComponent
        showModal={showModal}
        onClose={handleModal}
        onUpdate={handleUpdate}
      />
    </div>
  );
}

export default UserProfileComponent;

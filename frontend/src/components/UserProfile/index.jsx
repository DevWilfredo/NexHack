import { HeartPlus, ThumbsUp } from "lucide-react";
import React, { useEffect, useState } from "react";
import ChartComponent from "@components/chartComponent";
import { GetUserProfile } from "@services/";

function UserProfileComponent() {
  // Simula la información del usuario
  const [userInfo, setUserInfo] = useState({
    username: "octocat",
    name: "The Octocat",
    bio: "Just a friendly feline coding across the galaxy.",
    avatarUrl: `http://localhost:5000/api/v1/users/profile_pictures/user_1.png`,
    followers: 120,
    following: 42,
  });

  // Este estado controla qué sección está activa (repos, followers, etc.)
  const [activeTab, setActiveTab] = useState("global");

  // Estado para simular la lista de repositorios
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

  // Estado simulado de seguidores (podrías llenarlo con un fetch si quisieras)
  const [followers, setFollowers] = useState([
    { username: "devAlice" },
    { username: "devBob" },
  ]);

  // Estado simulado de seguidos
  const [hacksWins, sethacksWins] = useState([
    { hackname: "Angular solodev", timeLimit: "24 hours", ranked: "1st place" },
    { hackname: "devDiana", timeLimit: "48 hours", ranked: "2nd place" },
  ]);

  //prueba de conseguir el perffil del usuario
  // const [userProfile, setUserProfile] = useState(null);
  // useEffect(() => {
  //   const userId = 1; // Simula un ID de usuario
  //   GetUserProfile(userId).then((data) => {
  //     setUserProfile(data);
  //   });
  // }, []);

  return (
    <div className="flex justify-center">
      {/* Img de perfil, followers, me gustas. */}
      <div className="basis-64 items-center gap-4">
        <img
          src={userInfo.avatarUrl}
          alt="Avatar"
          className="w-24 h-24 rounded-full"
        />
        <div>
          <h1 className="text-2xl font-bold">{userInfo.name}</h1>
          <p className="text-sm text-gray-500">@{userInfo.username}</p>
          <button className="btn btn-sm mt-2 btn-outline ml-auto">
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
    </div>
  );
}

export default UserProfileComponent;

import React, { useEffect, useState } from "react";
import ChartComponent from "@components/chartComponent";
import { useAuth } from "@context/AuthContext";
import ModalUserUpdateComponent from "../ModalUserUpdate";
import { useTheme } from "@context/ThemeContext";
import SocialLinkDisplay from "../SocialLinksDisplay";
import TestimonialsSection from "../TestimonialsSection";
import HackathonHistory from "../HackathonsHistory";
import LikesSection from "../LikesSection";
import { ThumbsUp, Trophy, BarChart, Star } from "lucide-react";
import { useParams } from "react-router";
import { GetUserProfile, GetUserHackathons } from "@services";
import { motion } from "framer-motion";


function UserProfileComponent() {
  const { id } = useParams();
  const { user: authUser, setUser } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [userHackathons, setUserHackathons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState("global");
  const { isDark } = useTheme();
  const [search, setSearch] = useState("");

  const tabs = [
    { key: "global", label: "General", icon: BarChart },
    { key: "hackathons", label: "Hackathons", icon: Trophy },
    { key: "followers", label: "Likes", icon: ThumbsUp },
  ];

  const [followers] = useState([
    {
      username: "devAlice",
      fullName: "Alice Johnson",
      profile_picture: null,
      bio: "Frontend dev @Tesla",
      points: 1420,
      likedAt: "2024-06-15",
    },
    {
      username: "devAlice",
      fullName: "Pedro Ramirez",
      profile_picture: null,
      bio: "Backend dev @OpenAI",
      points: 4530,
      likedAt: "2024-03-20",
    },
  ]);

  const [hacksWins] = useState([
    { hackname: "Angular solodev", timeLimit: "24 hours", ranked: "1st place" },
    { hackname: "devDiana", timeLimit: "48 hours", ranked: "2nd place" },
  ]);

  const handleModal = () => setShowModal((prev) => !prev);
  const handleUpdate = (updatedData) =>{
    setProfileData(updatedData);
    setUser(updatedData); // Actualiza el usuario en el contexto
  } 

  // Obtener perfil cuando cambia el ID de la URL
  useEffect(() => {
  const fetchProfile = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const [profile, hackathons] = await Promise.all([
        GetUserProfile(id, token),
        GetUserHackathons(id, token),
      ]);
      setProfileData(profile);
      setUserHackathons(hackathons);
    } catch (error) {
      console.error("Error al obtener datos del perfil:", error);
    } finally {
      setTimeout(() => setLoading(false), 800);
    }
  };

  fetchProfile();
}, [id]);

  if (loading || !profileData) {
  return (
    <div className="flex justify-center items-center h-96 w-full">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1, rotate: 360 }}
        transition={{ duration: 1.2, ease: "easeInOut", repeat: Infinity }}
        className="w-16 h-16 rounded-full border-4 border-primary border-t-transparent"
      />
    </div>
  );
}

if (loading || !profileData) {
  return (
    <div className="flex justify-center items-center h-96 w-full">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1, rotate: 360 }}
        transition={{ duration: 1.2, ease: "easeInOut", repeat: Infinity }}
        className="w-16 h-16 rounded-full border-4 border-primary border-t-transparent"
      />
    </div>
  );
}

return (
  <div className="flex flex-wrap gap-8 p-6">
    {/* Profile section */}
    <div className="w-full md:w-72 flex flex-col items-center gap-4 bg-base-200 p-6 rounded-lg shadow-lg ">
      <img
        src={
          profileData?.profile_picture
            ? `${import.meta.env.VITE_API_URL}/users/profile_pictures/${profileData.profile_picture}`
            : `https://placehold.co/400x400?text=${
                profileData?.firstname?.charAt(0)?.toUpperCase() || "U"
              }`
        }
        alt="Avatar"
        className="w-24 h-24 rounded-full shadow-lg object-cover"
      />

      <div className="text-center">
        <h1 className="text-2xl font-bold">{`${profileData.firstname} ${profileData.lastname}`}</h1>
        {profileData.bio && (
          <p className="mt-2 text-sm text-base-content">{profileData.bio}</p>
        )}

        {authUser?.id === profileData?.id && (
          <button
            className={`btn ${isDark ? "btn-accent" : "btn-primary"} btn-sm mt-2`}
            onClick={handleModal}
          >
            Editar Perfil
          </button>
        )}
      </div>

      <div className="mt-4 flex gap-6">
        <span className="flex items-center gap-1 text-sm text-base-content">
          <Trophy className="text-yellow-400" /> {profileData.points || 0} Points
        </span>
        <span className="flex items-center gap-1 text-sm text-base-content">
          <ThumbsUp className="text-success" /> {profileData.likes || 0} Likes
        </span>
      </div>

      <div className="divider my-1" />
      <h3 className="text-2xl font-semibold text-base-content">Redes Sociales</h3>

      <div className="flex flex-col gap-4 w-full">
        <SocialLinkDisplay
          type="email"
          value={profileData.email || "Aún no has agregado tu correo electrónico"}
          isMissing={!profileData.email}
        />
        <SocialLinkDisplay
          type="website"
          value={profileData.website_url || "Aún no has agregado tu sitio web"}
          isMissing={!profileData.website_url}
        />
        <SocialLinkDisplay
          type="github"
          value={profileData.github_url || "Aún no has agregado tu cuenta de GitHub"}
          isMissing={!profileData.github_url}
        />
        <SocialLinkDisplay
          type="linkedin"
          value={
            profileData.linkedin_url || "Aún no has agregado tu perfil de LinkedIn"
          }
          isMissing={!profileData.linkedin_url}
        />
      </div>
    </div>

    {/* Main content */}
    <div className="flex-1 max-w-full space-y-6">
      <div className="flex flex-wrap gap-4 border-b pb-2">
        {tabs.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            className={`btn btn-ghost btn-sm flex items-center gap-1 ${
              activeTab === key ? "btn-active btn-primary" : ""
            }`}
            onClick={() => setActiveTab(key)}
          >
            <Icon size={16} />
            {label}
          </button>
        ))}
      </div>

      <div>
        {activeTab === "global" && <ChartComponent />}

        {activeTab === "hackathons" && (
          <HackathonHistory
            hackathons={userHackathons}
            search={search}
            setSearch={setSearch}
          />
        )}

        {activeTab === "followers" && <LikesSection likes={followers} />}

        {activeTab === "hacksWins" && (
          <ul className="space-y-2">
            {hacksWins.map((f, i) => (
              <div key={i} className="p-4 border rounded-box bg-base-200">
                <h2 className="font-semibold">{f.hackname}</h2>
                <p className="text-sm text-gray-400">
                  Time Limit: {f.timeLimit} — Ranked: {f.ranked}
                </p>
              </div>
            ))}
          </ul>
        )}

        <TestimonialsSection />
      </div>
    </div>

    {authUser?.id === profileData?.id && (
      <ModalUserUpdateComponent
        showModal={showModal}
        onClose={handleModal}
        onUpdate={handleUpdate}
      />
    )}
  </div>
);


}

export default UserProfileComponent;

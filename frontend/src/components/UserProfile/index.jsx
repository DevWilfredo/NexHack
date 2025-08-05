import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router";
import ChartComponent from "@components/chartComponent";
import { useAuth } from "@context/AuthContext";
import ModalUserUpdateComponent from "../ModalUserUpdate";
import { useTheme } from "@context/ThemeContext";
import SocialLinkDisplay from "../SocialLinksDisplay";
import TestimonialsSection from "../TestimonialsSection";
import HackathonHistory from "../HackathonsHistory";
import LikesSection from "../LikesSection";
import { ThumbsUp, Trophy, BarChart } from "lucide-react";
import {
  GetUserProfile,
  GetUserHackathons,
  GetUserLikes,
  GetUserTestimonials,
} from "@services";
import SpinnerLoader from "../SpinnerLoader";
import { motion } from "framer-motion";

function UserProfileComponent() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user: authUser, setUser } = useAuth();
  const { isDark } = useTheme();

  const [profileData, setProfileData] = useState(null);
  const [userHackathons, setUserHackathons] = useState([]);
  const [userLikes, setUserLikes] = useState([]);
  const [userTestimonials, setUserTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState("global");
  const [search, setSearch] = useState("");

  const tabs = [
    { key: "global", label: "General", icon: BarChart },
    { key: "hackathons", label: "Hackathons", icon: Trophy },
    { key: "followers", label: "Likes", icon: ThumbsUp },
  ];

  const handleModal = () => setShowModal((prev) => !prev);
  const handleUpdate = (updatedData) => {
    setProfileData(updatedData);
    setUser(updatedData);
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        const [profile, hackathons, likes, testimonials] = await Promise.all([
          GetUserProfile(id, token),
          GetUserHackathons(id, token),
          GetUserLikes(id, token),
          GetUserTestimonials(id, token),
        ]);

        setProfileData(profile);
        setUserHackathons(hackathons);
        setUserLikes(likes);
        setUserTestimonials(testimonials);
      } catch (error) {
        console.error("Error al obtener datos del perfil:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id]);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const tabParam = searchParams.get("tab");
    if (tabParam && tabs.some((t) => t.key === tabParam)) {
      setActiveTab(tabParam);
    } else {
      setActiveTab("global");
    }
  }, [location.search]);

  const handleTabChange = (key) => {
    setActiveTab(key);
    const searchParams = new URLSearchParams(location.search);
    searchParams.set("tab", key);
    navigate(`${location.pathname}?${searchParams.toString()}`, {
      replace: true,
    });
  };

  if (loading || !profileData) {
    return <SpinnerLoader />;
  }

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="flex flex-wrap gap-8 p-6">
      {/* Profile section */}
      <motion.div
        className="w-full md:w-72 flex flex-col items-center gap-4 bg-base-200 p-6 rounded-lg shadow-lg"
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        transition={{ duration: 0.5 }}
      >
        <img
          src={
            profileData?.profile_picture
              ? `${import.meta.env.VITE_API_URL}/users/profile_pictures/${
                  profileData.profile_picture
                }`
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
              className={`btn ${
                isDark ? "btn-accent" : "btn-primary"
              } btn-sm mt-2`}
              onClick={handleModal}
            >
              Editar Perfil
            </button>
          )}
        </div>

        <div className="mt-4 flex gap-6">
          <span className="flex items-center gap-1 text-sm text-base-content">
            <Trophy className="text-yellow-400" /> {profileData.points || 0}{" "}
            Points
          </span>
          <span className="flex items-center gap-1 text-sm text-base-content">
            <ThumbsUp className="text-success" /> {userLikes.length || 0} Likes
          </span>
        </div>

        <div className="divider my-1" />
        <h3 className="text-2xl font-semibold text-base-content">
          Redes Sociales
        </h3>

        <div className="flex flex-col gap-4 w-full">
          <SocialLinkDisplay
            type="email"
            value={
              profileData.email || "Aún no has agregado tu correo electrónico"
            }
            isMissing={!profileData.email}
          />
          <SocialLinkDisplay
            type="website"
            value={
              profileData.website_url || "Aún no has agregado tu sitio web"
            }
            isMissing={!profileData.website_url}
          />
          <SocialLinkDisplay
            type="github"
            value={
              profileData.github_url ||
              "Aún no has agregado tu cuenta de GitHub"
            }
            isMissing={!profileData.github_url}
          />
          <SocialLinkDisplay
            type="linkedin"
            value={
              profileData.linkedin_url ||
              "Aún no has agregado tu perfil de LinkedIn"
            }
            isMissing={!profileData.linkedin_url}
          />
        </div>
      </motion.div>

      {/* Main content */}
      <motion.div
        className="flex-1 max-w-full space-y-6"
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="flex flex-wrap gap-4 border-b pb-2">
          {tabs.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              className={`btn btn-ghost btn-sm flex items-center gap-1 ${
                activeTab === key ? "btn-active btn-primary" : ""
              }`}
              onClick={() => handleTabChange(key)}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </div>

        <div>
          {activeTab === "global" && <ChartComponent ProfileUser={profileData} />}
          {activeTab === "hackathons" && (
            <HackathonHistory
              hackathons={userHackathons}
              search={search}
              setSearch={setSearch}
            />
          )}
          {activeTab === "followers" && <LikesSection likes={userLikes} />}
          <TestimonialsSection testimonials={userTestimonials} />
        </div>
      </motion.div>

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

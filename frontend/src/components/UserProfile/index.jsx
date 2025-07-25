import React, { useState } from "react";
import ChartComponent from "@components/chartComponent";
import { useAuth } from "@context/AuthContext";
import ModalUserUpdateComponent from "../ModalUserUpdate";
import { useTheme } from "@context/ThemeContext";
import SocialLinkDisplay from "../SocialLinksDisplay";
import TestimonialsSection from "../TestimonialsSection";
import HackathonHistory from "../HackathonsHistory";
import LikesSection from "../LikesSection";
import { ThumbsUp, Trophy, BarChart, Star } from "lucide-react";

function UserProfileComponent() {
  const { user, setUser } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState("global");
  const { isDark } = useTheme();
  const [search, setSearch] = useState("");

  const sampleHackathons = [
    {
      name: "Hack4World 2024",
      date: "2024-04-15",
      teamName: "CodeWizards",
      ranking: 1,
      description: "An AI-based solution for sustainable agriculture.",
      projectLink: "https://github.com/codewizards/hack4world",
      deployLink: "https://hack4world.app",
      hackathonLink: "https://hack4world.com",
    },
    {
      name: "JS Challenge",
      date: "2023-11-02",
      teamName: "SoloDev",
      ranking: 5,
      description: "Real-time collaboration app using Socket.IO",
      projectLink: "https://github.com/solodev/js-challenge",
      deployLink: null,
      hackathonLink: "https://jschallenge.dev",
    },
    {
      name: "HackAI",
      date: "2024-06-10",
      teamName: "ByteForce",
      ranking: 3,
      description: "AI chatbot trained on legal documents.",
      projectLink: "https://github.com/byteforce/hackai",
      deployLink: "https://legalbot.io",
      hackathonLink: "https://hackai.dev",
    },
  ];

  const tabs = [
    { key: "global", label: "General", icon: BarChart },
    { key: "hackathons", label: "Hackathons", icon: Trophy },
    { key: "followers", label: "Likes", icon: ThumbsUp },
    { key: "hacksWins", label: "Ranked places", icon: Star },
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
  const handleUpdate = (updatedData) => setUser(updatedData);

  const filteredHackathons = sampleHackathons.filter(
    (h) =>
      h.name.toLowerCase().includes(search.toLowerCase()) ||
      h.teamName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-wrap gap-8 p-6">
      {/* Profile section */}
      <div className="w-full md:w-72 flex flex-col items-center gap-4 bg-base-200 p-6 rounded-lg shadow-lg ">
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
          className="w-24 h-24 rounded-full shadow-lg object-cover"
        />

        <div className="text-center">
          <h1 className="text-2xl font-bold">{`${user.firstname} ${user.lastname}`}</h1>
          {user.bio && (
            <p className="mt-2 text-sm text-base-content">{user.bio}</p>
          )}

          <button
            className={`btn ${
              isDark ? "btn-accent" : "btn-primary"
            } btn-sm mt-2`}
            onClick={handleModal}
          >
            Editar Perfil
          </button>
        </div>

        <div className="mt-4 flex gap-6">
          <span className="flex items-center gap-1 text-sm text-base-content">
            <Trophy className="text-yellow-400" /> {user.points || 0} Points
          </span>
          <span className="flex items-center gap-1 text-sm text-base-content">
            <ThumbsUp className="text-success" /> {user.likes || 0} Likes
          </span>
        </div>

        <div className="divider my-1" />
        <h3 className="text-2xl font-semibold text-base-content">
          Redes Sociales
        </h3>

        <div className="flex flex-col gap-4 w-full">
          <SocialLinkDisplay
            type="email"
            value={user.email || "Aún no has agregado tu correo electrónico"}
            isMissing={!user.email}
          />
          <SocialLinkDisplay
            type="website"
            value={user.website_url || "Aún no has agregado tu sitio web"}
            isMissing={!user.website_url}
          />
          <SocialLinkDisplay
            type="github"
            value={user.github_url || "Aún no has agregado tu cuenta de GitHub"}
            isMissing={!user.github_url}
          />
          <SocialLinkDisplay
            type="linkedin"
            value={
              user.linkedin_url || "Aún no has agregado tu perfil de LinkedIn"
            }
            isMissing={!user.linkedin_url}
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
              hackathons={filteredHackathons}
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

      <ModalUserUpdateComponent
        showModal={showModal}
        onClose={handleModal}
        onUpdate={handleUpdate}
      />
    </div>
  );
}

export default UserProfileComponent;

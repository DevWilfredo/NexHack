import { useState } from "react";
import { Search } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { motion } from "framer-motion";

function LeaderboardPage() {
  const { globalUsers } = useApp();
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filtered = globalUsers
    .filter((user) =>
      user.firstname.toLowerCase().includes(search.toLowerCase()) ||
      user.lastname.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => b.points - a.points);

  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  const getRankStyle = (index) => {
    switch (index) {
      case 0: return "bg-yellow-400 text-black";
      case 1: return "bg-gray-400 text-black";
      case 2: return "bg-amber-700 text-white";
      default: return "bg-base-300 text-base-content";
    }
  };

  // Bordes/bordados especiales para los 3 primeros
  const getBorderStyle = (rank) => {
  switch (rank) {
    case 1:
      return "metal-shine border-metal-gold";
    case 2:
      return "metal-shine border-metal-silver";
    case 3:
      return "metal-shine border-metal-copper";
    default:
      return "";
  }
};


  const renderMedal = (rank) => {
    const colors = ["text-yellow-400", "text-gray-400", "text-amber-700"];
    const medals = ["🥇", "🥈", "🥉"];
    return (
      <motion.div
        className={`text-2xl ${colors[rank - 1]}`}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        {medals[rank - 1]}
      </motion.div>
    );
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      <h1 className="text-4xl font-bold text-center">🏆 Leaderboard</h1>

      <div className="flex items-center gap-2 w-full max-w-md mx-auto">
        <Search className="text-gray-400" />
        <input
          type="text"
          placeholder="Buscar por nombre o username"
          className="input input-bordered w-full"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <ul className="space-y-4">
        {paginated.map((user, idx) => {
          const absoluteIndex = (currentPage - 1) * itemsPerPage + idx;
          const rank = absoluteIndex + 1;

          return (
            <li
              key={user.id}
              className={`flex items-center gap-4 p-4 rounded-lg shadow bg-base-200 ${getBorderStyle(rank)}`}
            >
              <motion.div
                className={`w-10 h-10 flex items-center justify-center rounded-full font-bold ${getRankStyle(absoluteIndex)}`}
                animate={{ boxShadow: rank <= 3 ? "0px 0px 10px rgba(255, 215, 0, 0.6)" : "none" }}
                transition={{ duration: 0.5 }}
              >
                {rank <= 3 ? renderMedal(rank) : rank}
              </motion.div>

              <img
                src={
                  user.profile_picture
                    ? `${import.meta.env.VITE_API_URL}/users/profile_pictures/${user.profile_picture}`
                    : `https://placehold.co/100x100?text=${user.firstname.charAt(0)}`
                }
                alt={user.firstname}
                className="w-14 h-14 rounded-full object-cover"
              />

              <div className="flex-1">
                <h2 className="text-lg font-semibold">{user.firstname} {user.lastname}</h2>
                <p className="text-sm text-base-content">{user.bio || "Sin bio"}</p>
              </div>

              <div className="text-right">
                <span className="text-xl font-bold">{user.points || 0} pts</span>
                <br />
                <a href={`/profile/${user.username}`} className="btn btn-sm btn-primary mt-3">
                  Ver perfil
                </a>
              </div>
            </li>
          );
        })}
      </ul>

      <div className="flex justify-center gap-2 mt-6">
        {Array.from({ length: totalPages }).map((_, idx) => (
          <button
            key={idx}
            className={`btn btn-sm ${currentPage === idx + 1 ? "btn-primary" : "btn-ghost"}`}
            onClick={() => setCurrentPage(idx + 1)}
          >
            {idx + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

export default LeaderboardPage;

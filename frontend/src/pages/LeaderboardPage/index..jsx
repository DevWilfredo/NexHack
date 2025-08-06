import { useEffect, useState } from "react";
import { useDebounce } from "react-use";
import { Search, SearchX } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { motion, AnimatePresence } from "framer-motion";
import { NavLink } from "react-router";

function LeaderboardPage() {
  const { globalUsers } = useApp();
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Debounce del valor ingresado
  useDebounce(
    () => {
      setDebouncedSearch(search);
      setCurrentPage(1); // reseteamos la paginación al filtrar
    },
    500,
    [search]
  );

  const rankedUsers = [...globalUsers]
    .sort((a, b) => b.points - a.points)
    .map((user, index) => ({ ...user, rank: index + 1 }));

  const filtered = rankedUsers.filter(
    (user) =>
      user.firstname.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      user.lastname.toLowerCase().includes(debouncedSearch.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getRankStyle = (index) => {
    switch (index) {
      case 0:
        return "bg-yellow-400 text-black";
      case 1:
        return "bg-gray-400 text-black";
      case 2:
        return "bg-amber-700 text-white";
      default:
        return "bg-base-300 text-base-content";
    }
  };

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
    <motion.div
      className="p-8 max-w-4xl mx-auto space-y-6"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
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

      <motion.ul layout className="space-y-4 min-h-[200px]">
        <AnimatePresence>
          {paginated.length === 0 ? (
            <motion.div
              key="no-results"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center justify-center text-center text-base-content/70 p-10"
            >
              <SearchX className="w-12 h-12 mb-4 text-gray-400" />
              <p className="text-lg font-semibold">
                No se encontraron usuarios
              </p>
              <p className="text-sm">Intenta con otro nombre o apellido</p>
            </motion.div>
          ) : (
            paginated.map((user) => (
              <motion.li
                key={user.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className={`flex items-center gap-4 p-4 rounded-lg shadow bg-base-200 ${getBorderStyle(
                  user.rank
                )}`}
              >
                <motion.div
                  className={`w-10 h-10 flex items-center justify-center rounded-full font-bold ${getRankStyle(
                    user.rank - 1
                  )}`}
                  animate={{
                    boxShadow:
                      user.rank <= 3
                        ? "0px 0px 10px rgba(255, 215, 0, 0.6)"
                        : "none",
                  }}
                  transition={{ duration: 0.5 }}
                >
                  {user.rank <= 3 ? renderMedal(user.rank) : user.rank}
                </motion.div>

                <img
                  src={
                    user.profile_picture
                      ? `${
                          import.meta.env.VITE_API_URL
                        }/users/profile_pictures/${user.profile_picture}`
                      : `https://placehold.co/100x100?text=${user.firstname.charAt(
                          0
                        )}`
                  }
                  alt={user.firstname}
                  className="w-14 h-14 rounded-full object-cover"
                />

                <div className="flex-1">
                  <h2 className="text-lg font-semibold">
                    {user.firstname} {user.lastname}
                  </h2>
                  <p className="text-sm text-base-content">
                    {user.bio || "Sin bio"}
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-xl font-bold">
                    {user.points || 0} pts
                  </span>
                  <br />
                  <NavLink
                    to={`/profile/${user.id}`}
                    className="btn btn-sm btn-primary mt-3"
                  >
                    Ver perfil
                  </NavLink>
                </div>
              </motion.li>
            ))
          )}
        </AnimatePresence>
      </motion.ul>

      <div className="flex justify-center gap-2 mt-6">
        {Array.from({ length: totalPages }).map((_, idx) => (
          <button
            key={idx}
            className={`btn btn-sm ${
              currentPage === idx + 1 ? "btn-primary" : "btn-ghost"
            }`}
            onClick={() => setCurrentPage(idx + 1)}
          >
            {idx + 1}
          </button>
        ))}
      </div>
    </motion.div>
  );
}

export default LeaderboardPage;

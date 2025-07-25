import { useState } from "react";
import { NavLink } from "react-router";
import { useTheme } from "@context/ThemeContext";
import { Search } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const HackathonTable = ({ hackathons = [], formatoFecha, calcularHoras }) => {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const { isDark } = useTheme();

  const filteredHackathons = hackathons.filter((h) =>
    h.title.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredHackathons.length / itemsPerPage);

  const paginatedHackathons = filteredHackathons.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div
      className={`${
        isDark ? "bg-slate-900/80" : "bg-base-200"
      } rounded-2xl p-6 shadow-lg border border-info/20`}
    >
      {/* Header con buscador */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Search className="text-base-content" size={20} />
          <input
            type="text"
            placeholder="Buscar hackathon..."
            className={`input input-sm input-bordered w-64 ${isDark ? 'bg-slate-900/80' : ''}`}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
      </div>

      {/* Tabla */}
      <div className={`overflow-x-auto rounded-xl ${isDark ? '' : 'bg-white'}`}>
        <table className="table w-full table-zebra table-pin-rows">
          <thead className="bg-base-100 text-base-content uppercase text-sm">
            <tr>
              <th className="px-4 py-3 text-left">Hackathon</th>
              <th className="px-4 py-3 text-left">Creador</th>
              <th className="px-4 py-3 text-left">Fecha</th>
              <th className="px-4 py-3 text-left">Duración</th>
              <th className="px-4 py-3 text-left">Status</th>
            </tr>
          </thead>

          <AnimatePresence mode="wait">
            <motion.tbody
              key={currentPage + search}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              {paginatedHackathons.length > 0 ? (
                paginatedHackathons.map((hackathon) => (
                  <tr
                    key={hackathon.id}
                    className="hover:bg-base-300 hover:cursor-pointer transition-all duration-150"
                  >
                    <td className="px-4 py-3 font-medium">
                      <NavLink
                        to={`/hackathons/${hackathon.id}`}
                        className="link link-hover link-base-content"
                      >
                        {hackathon.title}
                      </NavLink>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {hackathon.creator?.name || "Desconocido"}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {formatoFecha(hackathon.start_date)}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {calcularHoras(
                        hackathon.start_date,
                        hackathon.end_date
                      )}{" "}
                      horas
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`badge badge-outline ${
                          hackathon.status === "pending"
                            ? "badge-warning"
                            : hackathon.status === "closed"
                            ? "badge-error"
                            : "badge-success"
                        }`}
                      >
                        {hackathon.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="text-center py-6 text-base-content/70"
                  >
                    No se encontraron hackathones.
                  </td>
                </tr>
              )}
            </motion.tbody>
          </AnimatePresence>
        </table>
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-4 gap-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`btn btn-sm rounded-full ${
                currentPage === i + 1 ? isDark ? 'btn-accent' : 'btn-primary' : "btn-ghost"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default HackathonTable;

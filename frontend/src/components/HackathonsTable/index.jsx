import { useState } from "react";
import { NavLink } from "react-router";
import { useTheme } from "@context/ThemeContext";
import { Search } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import CrearHackathonModal from "../CrearHackathon";
import { useDebounce } from "react-use";

const HackathonTable = ({ hackathons = [], formatoFecha, calcularHoras }) => {
  const [inputValue, setInputValue] = useState("");
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

  useDebounce(
    () => {
      setSearch(inputValue);
      setCurrentPage(1);
    },
    400,
    [inputValue]
  );

  return (
    <div className={`border-base-200 rounded-2xl p-6 shadow-lg border`}>
      {/* Header con buscador */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <div className="flex items-center gap-2">
          <Search className="text-base-content" size={20} />
          <input
            type="text"
            placeholder="Buscar hackathon..."
            className="input input-sm input-bordered w-full sm:w-64"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
        </div>
        <CrearHackathonModal />
      </div>

      {/* Tabla */}
      <div className={`overflow-x-auto rounded-xl ${isDark ? "" : "bg-white"}`}>
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
                      <NavLink
                        to={`/profile/${hackathon.creator.id}`}
                        className={`link link-hover link-base-content`}
                      >
                        {`${hackathon.creator?.firstname} ${hackathon.creator?.lastname}` ||
                          "Desconocido"}
                      </NavLink>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {formatoFecha(hackathon.start_date)}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {calcularHoras(hackathon.start_date, hackathon.end_date)}{" "}
                      horas
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`badge badge-outline ${
                          hackathon.status === "pending"
                            ? "badge-warning"
                            : hackathon.status === "cancelled"
                            ? "badge-error"
                            : hackathon.status === "open"
                            ? "badge-success"
                            : "badge-info"
                        }`}
                      >
                        {hackathon.status === "pending"
                          ? "Pendiente"
                          : hackathon.status === "cancelled"
                          ? "Cancelado"
                          : hackathon.status === "open"
                            ? "Abierto"
                          : "Finalizado"}
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
                currentPage === i + 1
                  ? isDark
                    ? "btn-accent"
                    : "btn-primary"
                  : "btn-ghost"
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

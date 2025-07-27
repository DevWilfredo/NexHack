import { useState } from "react";
import { useTheme } from "@context/ThemeContext";
import { useApp } from "@context/AppContext";
import { useAuth } from "@context/AuthContext";
import { Search, UserCheck, UserX } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { formatoFecha } from "@utilities/dateUtils";
import toast from "react-hot-toast";

const RequestsTable = ({ requests = [] }) => {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const { isDark } = useTheme();
  const { handleInvitation } = useApp();
  const { user: authUser } = useAuth();

  const getRequestUserName = (request) => {
    const { user, requested_by } = request;

    // Si yo envié la solicitud → mostrar el target (user)
    if (requested_by.id === authUser.id) {
      return `${user.firstname} ${user.lastname}`;
    }

    // Si yo soy el target → mostrar quién la envió (requested_by)
    return `${requested_by.firstname} ${requested_by.lastname}`;
  };

  const filteredRequests = requests.filter(
    (r) =>
      r.requested_by.firstname.toLowerCase().includes(search.toLowerCase()) ||
      r.requested_by.lastname.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);
  const paginatedRequests = filteredRequests.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleAction = (request, action) => {
    toast.promise(handleInvitation(request.id, action), {
      loading: action === "accept" ? "Aceptando..." : "Rechazando...",
      success:
        action === "accept" ? "Solicitud aceptada" : "Solicitud rechazada",
      error: "Error al procesar la solicitud",
    });
  };

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
            placeholder="Buscar por usuario..."
            className={`input input-sm input-bordered w-64 ${
              isDark ? "bg-slate-900/80" : ""
            }`}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
      </div>

      {/* Tabla */}
      <div className={`overflow-x-auto rounded-xl ${isDark ? "" : "bg-white"}`}>
        <table className="table w-full table-zebra table-pin-rows">
          <thead className="bg-base-100 text-base-content uppercase text-sm">
            <tr>
              <th className="px-4 py-3 text-left">Usuario</th>
              <th className="px-4 py-3 text-left">Tipo</th>
              <th className="px-4 py-3 text-left">Fecha</th>
              <th className="px-4 py-3 text-left">Estado</th>
              <th className="px-4 py-3 text-left">Acciones</th>
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
              {paginatedRequests.length > 0 ? (
                paginatedRequests.map((request) => (
                  <tr
                    key={request.id}
                    className="hover:bg-base-300 transition-all duration-150"
                  >
                    <td className="px-4 py-3 font-medium">
                      {getRequestUserName(request)}
                    </td>
                    <td className="px-4 py-3 text-sm capitalize">
                      {request.type === "invitation"
                        ? "Invitación"
                        : "Solicitud"}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {formatoFecha(request.created_at)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`badge badge-outline ${
                          request.status === "pending"
                            ? "badge-warning"
                            : request.status === "accepted"
                            ? "badge-success"
                            : "badge-error"
                        }`}
                      >
                        {request.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 flex gap-2">
                      {authUser.id === request.requested_by.id ? (
                        // Yo envié la solicitud → puedo cancelarla
                        <button
                          className="btn btn-sm btn-error text-white"
                          onClick={() => handleAction(request, "reject")}
                          disabled={request.status !== "pending"}
                        >
                          <UserX className="w-4 h-4 mr-1" />
                          Cancelar
                        </button>
                      ) : (
                        // Yo soy el target → puedo aceptar o rechazar
                        <>
                          <button
                            className="btn btn-sm btn-success"
                            onClick={() => handleAction(request, "accept")}
                            disabled={request.status !== "pending"}
                          >
                            <UserCheck className="w-4 h-4 mr-1" />
                            Aceptar
                          </button>
                          <button
                            className="btn btn-sm btn-error text-white"
                            onClick={() => handleAction(request, "reject")}
                            disabled={request.status !== "pending"}
                          >
                            <UserX className="w-4 h-4 mr-1" />
                            Rechazar
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="text-center py-6 text-base-content/70"
                  >
                    No se encontraron solicitudes.
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

export default RequestsTable;

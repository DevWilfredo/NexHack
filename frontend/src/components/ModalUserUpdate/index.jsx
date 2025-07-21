// ModalUserUpdateComponent.jsx

import { updateUserProfile } from "@services"; // Asegúrate de que el alias o path sea correcto
import { useState, useEffect } from "react";
import { useAuth } from "@context/AuthContext";

const ModalUserUpdateComponent = ({ showModal, onClose, onUpdate }) => {
  const { userToken, user } = useAuth();
  const [newdata, setNewData] = useState({ ...user });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState(false);
  //validacion con regex ya que daisyUI no tiene uno interno
  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleEmailBlur = () => {
    setEmailError(!validateEmail(newdata.email));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewData((prev) => ({ ...prev, avatarFile: file }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const updatedUser = await updateUserProfile(user.id, newdata, userToken);
      console.log(updatedUser);
      onUpdate(updatedUser); // Actualiza el padre con la respuesta del backend
    } catch (err) {
      setError(err.message || "Error actualizando usuario");
    } finally {
      setLoading(false);
      onClose(); // Cierra el modal pase lo que pase
    }
  };

  const handleCancel = () => {
    setNewData({ ...user });
    onClose();
  };

  useEffect(() => {
    const modal = document.getElementById("edit_user_modal");
    if (showModal && user) {
      setNewData({ ...user });
      modal?.showModal();
    } else {
      modal?.close();
    }
  }, [showModal, user]);

  return (
    <dialog id="edit_user_modal" className="modal">
      <div className="modal-box w-full max-w-2xl">
        <h3 className="font-bold text-lg">Editar perfil de usuario</h3>
        {error && <p className="text-error text-sm">{error}</p>}
        <form method="dialog" onSubmit={handleSubmit}>
          <div className="flex gap-5 mt-4">
            {/* Avatar + botón */}
            <div className="flex flex-col items-center gap-2">
              <img
                src={
                  newdata.profile_picture
                    ? `${import.meta.env.VITE_API_URL}/users/profile_pictures/${
                        newdata.profile_picture
                      }`
                    : `https://placehold.co/400x400?text=${
                        newdata.firstname?.charAt(0)?.toUpperCase() || "U"
                      }`
                }
                alt="Avatar"
                className="w-32 h-32 rounded-full object-cover"
              />
              <label className="btn btn-sm btn-accent" htmlFor="profile-pic">
                Cambiar foto de perfil
              </label>
              <input
                id="profile-pic"
                type="file"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>

            {/* Inputs */}
            <div className="flex flex-col gap-4 w-full">
              <label>First Name</label>
              <input
                type="text"
                name="firstname"
                placeholder="Nombre"
                className="input input-bordered"
                value={newdata.firstname || ""}
                onChange={handleInputChange}
              />
              <label>Last Name</label>
              <input
                type="text"
                name="lastname"
                placeholder="Apellido"
                className="input input-bordered"
                value={newdata.lastname || ""}
                onChange={handleInputChange}
              />
              <label>Email</label>
              <input
                type="email"
                name="email"
                placeholder="Correo"
                className={`input input-bordered mb-0 pb-0 ${
                  emailError ? "border-red-500" : "border-success"
                }`}
                value={newdata.email || ""}
                onChange={handleInputChange}
                onBlur={handleEmailBlur}
                required
              />
              {emailError && (
                <p className="text-red-500 text-sm mt-0 pt-0">
                  El correo no es válido
                </p>
              )}
            </div>
          </div>

          {/* Acciones */}
          <div className="modal-action">
            <button
              type="submit"
              className={`btn btn-success ${loading ? "btn-disabled" : ""}`}
            >
              {loading ? "Guardando..." : "Guardar cambios"}
            </button>
            <button type="button" className="btn" onClick={handleCancel}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
};

export default ModalUserUpdateComponent;

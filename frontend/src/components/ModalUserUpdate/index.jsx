import { updateUserProfile } from "@services";
import { useEffect, useState } from "react";
import { useAuth } from "@context/AuthContext";
import InputComponent from "@components/InputComponent";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useTheme } from "@context/ThemeContext";

const ModalUserUpdateComponent = ({ showModal, onClose, onUpdate }) => {
  const { userToken, user } = useAuth();
  const [previewImage, setPreviewImage] = useState(null);
  const { isDark } = useTheme();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      firstname: "",
      lastname: "",
      email: "",
      avatarFile: null,
      bio: "",
      website_url: "",
      github_url: "",
      linkedin_url: "",
    },
  });

  const onSubmit = async (formData) => {
  const toastId = toast.loading("Actualizando perfil...");

  try {
    const updatedUser = await updateUserProfile(user.id, formData, userToken);
    toast.success("Perfil actualizado correctamente", { id: toastId });
    onUpdate(updatedUser);
    onClose();
  } catch (err) {
    toast.error(err.message || "Error al actualizar", { id: toastId });
  }
};

  const handleFileChange = (e) => {
  const file = e.target.files?.[0];
  if (file) {
    setValue("avatarFile", file);
    setPreviewImage(URL.createObjectURL(file));
    toast.success("Imagen cargada correctamente");
  }
};


  const handleCancel = () => {
  reset();
  setPreviewImage(null); // limpiar preview
  onClose();
};

  useEffect(() => {
  const modal = document.getElementById("edit_user_modal");
  if (showModal && user) {
    reset({
      firstname: user.firstname || "",
      lastname: user.lastname || "",
      email: user.email || "",
      avatarFile: null,
      bio: user.bio || "",
      website_url: user.website_url || "",
      github_url: user.github_url || "",
      linkedin_url: user.linkedin_url || "",
    });
    setPreviewImage(null); // limpiar preview al abrir
    modal?.showModal();
  } else {
    modal?.close();
  }
}, [showModal, user, reset]);

  return (
    <dialog id="edit_user_modal" className="modal">
      <div
        className={`modal-box w-full max-w-2xl  bg-base-200 shadow-xl/20 ${
          isDark ? "shadow-accent" : "shadow-primary"
        } border border-info/1`}
      >
        <h3 className="font-bold text-lg">Editar perfil de usuario</h3>

        <form method="dialog" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex gap-5 mt-4">
            {/* Avatar */}
            <div className="flex flex-col items-center gap-2">
              <img
  src={
    previewImage ||
    (user?.profile_picture
      ? `${import.meta.env.VITE_API_URL}/users/profile_pictures/${user.profile_picture}`
      : `https://placehold.co/400x400?text=${user?.firstname?.charAt(0)?.toUpperCase() || "U"}`)
  }
  alt="Avatar"
  className="w-32 h-32 rounded-full object-cover"
/>
              <label className={`btn btn-sm p-2 ${isDark ? 'btn-accent' : 'btn-primary'}`} htmlFor="profile-pic">
                Cambiar foto de perfil
              </label>
              <input
                id="profile-pic"
                type="file"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>

            {/* Form Inputs */}
            <div className="flex flex-col gap-2 w-full">
              <InputComponent
                label="Nombre"
                name="firstname"
                placeholder="Nombre"
                register={register}
                error={errors.firstname}
              />
              <InputComponent
                label="Apellido"
                name="lastname"
                placeholder="Apellido"
                register={register}
                error={errors.lastname}
              />
              <InputComponent
                label="Bio"
                name="bio"
                placeholder="Escribe algo sobre ti..."
                register={register}
                error={errors.bio}
              />
              <InputComponent
                label="Sitio Web"
                name="website_url"
                placeholder="www.ejemplo.com"
                register={register}
                error={errors.website_url}
              />
              <InputComponent
                label="Github"
                name="github_url"
                placeholder="https://github.com/usuario"
                register={register}
                error={errors.github_url}
              />
              <InputComponent
                label="Linkedin"
                name="linkedin_url"
                placeholder="https://linkedin.com/in/usuario"
                register={register}
                error={errors.linkedin_url}
              />
              <InputComponent
                label="Correo"
                name="email"
                type="email"
                placeholder="Correo"
                register={register}
                error={errors.email}
                rules={{
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "El correo no es válido",
                  },
                }}
              />
            </div>
          </div>

          {/* Acciones */}
          <div className="modal-action">
            <button
              type="submit"
              className={`btn ${isDark ? 'btn-accent' : 'btn-primary'} ${isSubmitting ? "btn-disabled" : ""}`}
            >
              {isSubmitting ? "Guardando..." : "Guardar cambios"}
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
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { useState } from "react";
const ModalUserUpdateComponent = ({ showModal, onClose, user, onUpdate }) => {
  const [newdata, setNewData] = useState({ ...user });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewData((prev) => ({ ...prev, [name]: value }));
  };
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Guardamos el archivo directamente o puedes convertirlo a base64 si necesitas mostrarlo
      setNewData((prev) => ({ ...prev, avatarFile: file }));
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();

    // Aquí puedes enviar `newData` a tu backend
    console.log("Datos actualizados:", newdata);
    onUpdate(newdata);

    // Lógica para cerrar modal
    onClose();
  };
  const handleClose = () => {
    setNewData({ ...user });
    onClose();
  };
  return (
    <Dialog open={showModal} onClose={onClose} className="relative z-10">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
      />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel
            transition
            className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-lg data-closed:sm:translate-y-0 data-closed:sm:scale-95"
          >
            {/* Contenido del modal */}
            <div className="bg-primary px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <DialogTitle as="h3" className="text-base font-semibold ">
                    Editar perfil de usuario
                  </DialogTitle>
                  <div className="">
                    <form id="edit-user-form" onSubmit={handleSubmit}>
                      <div className="flex gap-5">
                        {/* Avatar + Botón centrado */}
                        <div className="mt-5 flex flex-col items-center justify-center gap-2">
                          <img
                            src={user.avatarUrl}
                            alt="Avatar"
                            className="w-48 h-48 rounded-full"
                          />

                          <label
                            htmlFor="profile-pic"
                            className="btn btn-sm  btn-accent cursor-pointer"
                          >
                            Cambiar foto de perfil
                          </label>

                          <input
                            id="profile-pic"
                            type="file"
                            className="hidden"
                            onChange={handleFileChange}
                          />
                        </div>

                        {/* Inputs de usuario */}
                        <div className="flex flex-col gap-4">
                          <fieldset className="fieldset">
                            <legend className="fieldset-legend text-accent">
                              First Name
                            </legend>
                            <input
                              type="text"
                              className="input"
                              name="firstname"
                              placeholder="Type here"
                              value={newdata.firstname}
                              onChange={handleInputChange}
                            />
                          </fieldset>

                          <fieldset className="fieldset">
                            <legend className="fieldset-legend text-accent">
                              Last Name
                            </legend>
                            <input
                              type="text"
                              name="lastname"
                              className="input"
                              placeholder="Type here"
                              value={newdata.lastname}
                              onChange={handleInputChange}
                            />
                          </fieldset>

                          <fieldset className="fieldset">
                            <legend className="fieldset-legend text-accent">
                              Email
                            </legend>
                            <label className="input validator">
                              <svg
                                className="h-[1em] opacity-50"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                              >
                                <g
                                  strokeLinejoin="round"
                                  strokeLinecap="round"
                                  strokeWidth="2.5"
                                  fill="none"
                                  stroke="currentColor"
                                >
                                  <rect
                                    width="20"
                                    height="16"
                                    x="2"
                                    y="4"
                                    rx="2"
                                  ></rect>
                                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                                </g>
                              </svg>
                              <input
                                type="email"
                                placeholder="mail@site.com"
                                required
                                name="email"
                                value={newdata.email}
                                onChange={handleInputChange}
                              />
                            </label>
                            <div className="validator-hint hidden">
                              Enter valid email address
                            </div>
                          </fieldset>
                        </div>
                      </div>

                      {/* Botón para guardar cambios */}
                      <div className="mt-6 text-right"></div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-secondary px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
              <button
                type="submit"
                form="edit-user-form"
                className="inline-flex w-full justify-center rounded-md bg-success px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-green-500 sm:ml-3 sm:w-auto"
              >
                Save Changes
              </button>
              <button
                type="button"
                data-autofocus
                onClick={handleClose}
                className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs ring-1 ring-gray-300 ring-inset hover:bg-gray-50 sm:mt-0 sm:w-auto"
              >
                Cancel
              </button>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};

export default ModalUserUpdateComponent;

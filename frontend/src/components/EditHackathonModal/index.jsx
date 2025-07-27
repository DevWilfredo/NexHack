import { useState, useEffect } from "react";
import {
  Calendar,
  Tag,
  FileText,
  TextCursorInput,
  X,
  ListTodo,
} from "lucide-react";
import { useTheme } from "@context/ThemeContext";
import { toast } from "react-hot-toast";
import { fetchSingleHackathon, updateHackathon } from "../../services";
import { useApp } from "@context/AppContext";

function EditHackathonModal({
  showModal,
  onClose,
  userToken,
  hackathon,
  onUpdate,
  tags,
}) {
  const { isDark } = useTheme();
  const [loading, setLoading] = useState(false);
  const { fetchMyHackathons } = useApp();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    start_date: "",
    end_date: "",
    status: "pending",
    tags: [],
    rules: [],
  });

  useEffect(() => {
    if (showModal && hackathon) {
      setFormData({
        title: hackathon.title || "",
        description: hackathon.description || "",
        start_date: hackathon.start_date?.slice(0, 10) || "",
        end_date: hackathon.end_date?.slice(0, 10) || "",
        status: hackathon.status || "pending",
        tags: hackathon.tags?.map((t) => t.name) || [],
        rules: hackathon.rules?.map((r) => r.rule_text) || [],
      });
    }
  }, [showModal, hackathon]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleListInputChange = (e, index, field) => {
    const newList = [...formData[field]];
    newList[index] = e.target.value;
    setFormData((prev) => ({ ...prev, [field]: newList }));
  };

  const addToList = (field) => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field], ""],
    }));
  };

  const removeFromList = (index, field) => {
    const newList = [...formData[field]];
    newList.splice(index, 1);
    setFormData((prev) => ({ ...prev, [field]: newList }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.start_date || !formData.end_date) {
      toast.error("Ambas fechas son obligatorias.");
      return;
    }

    const start = new Date(formData.start_date).toISOString();
    const end = new Date(formData.end_date).toISOString();

    if (start > end) {
      toast.error("La fecha de inicio no puede ser posterior a la de fin.");
      return;
    }

    setLoading(true);
    const toastId = toast.loading("Actualizando hackathon...");

    try {
      const updatedData = {
        title: formData.title,
        description: formData.description,
        start_date: formData.start_date + "T05:00",
        end_date: formData.end_date + "T05:00",
        status: formData.status,
        tags: formData.tags.filter((tag) => tag.trim() !== ""),
        rules: formData.rules.filter((r) => r.trim() !== ""),
      };

      await updateHackathon({
        hackathonId: hackathon.id,
        token: userToken,
        updatedFields: updatedData,
      });

      const newData = await fetchSingleHackathon(hackathon.id, userToken);
      onUpdate(newData);
      toast.success("Hackathon actualizado correctamente", { id: toastId });
      onClose(); // Cierra el modal después de guardar
    } catch (err) {
      toast.error(err.message || "Error al actualizar", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <dialog open={showModal} id="edit_hackathon_modal" className="modal">
      <div
        className={`modal-box w-full max-w-2xl space-y-4 bg-base-300 shadow-xl/40 ${
          isDark ? "shadow-accent" : "shadow-primary"
        }`}
      >
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-lg">
            Editar Hackathon: {hackathon?.title}
          </h3>
          <button
            type="button"
            className="btn btn-xs btn-circle btn-ghost"
            onClick={onClose}
          >
            <X className="hover:text-error" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 bg-base-200 p-4 rounded-box"
        >
          {/* Title */}
          <div className="flex gap-x-3">
            <TextCursorInput />
            <input
              type="text"
              name="title"
              placeholder="Título"
              className="input input-bordered bg-base-300 w-full"
              value={formData.title}
              onChange={handleInputChange}
            />
          </div>

          {/* Description */}
          <div className="flex gap-x-3">
            <FileText />
            <textarea
              name="description"
              placeholder="Descripción"
              className="textarea textarea-bordered bg-base-300 w-full"
              value={formData.description}
              onChange={handleInputChange}
            />
          </div>

          {/* Fechas */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex gap-x-3 w-full">
              <Calendar />
              <input
                type="date"
                name="start_date"
                className="input input-bordered bg-base-300 w-full"
                value={formData.start_date}
                onChange={handleInputChange}
              />
            </div>

            <div className="flex gap-x-3 w-full">
              <Calendar />
              <input
                type="date"
                name="end_date"
                className="input input-bordered bg-base-300 w-full"
                value={formData.end_date}
                onChange={handleInputChange}
              />
            </div>
          </div>
          {/* Tags con selección desde la DB */}
          <div>
            <label className="label font-bold">Tags</label>

            {/* Visualización de tags seleccionadas */}
            <div className="flex flex-wrap gap-2 mt-3 mb-2">
              {formData.tags.map((tag) => {
                const fullTag = tags.find((t) => t.name === tag);
                return (
                  <div
                    key={tag}
                    className="badge badge-outline flex items-center gap-2 px-3 py-2"
                  >
                    {/* Ícono */}
                    {fullTag?.icon ? (
                      <span
                        className=""
                        dangerouslySetInnerHTML={{ __html: fullTag.icon }}
                      />
                    ) : (
                      <>
                        <Tag className="w-4 h-4" />
                        <span>{tag}</span>
                      </>
                    )}
                    <button
                      type="button"
                      className="ml-1 text-error font-bold"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          tags: prev.tags.filter((t) => t !== tag),
                        }))
                      }
                    >
                      ✕
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Selector de tags disponibles */}
            <div className="w-fit my-3">
              <select
                className="select select-bordered bg-base-300 min-w-[12rem]"
                onChange={(e) => {
                  const selectedTag = e.target.value;
                  if (selectedTag && !formData.tags.includes(selectedTag)) {
                    setFormData((prev) => ({
                      ...prev,
                      tags: [...prev.tags, selectedTag],
                    }));
                  }
                  e.target.value = ""; // reset
                }}
                defaultValue=""
              >
                <option value="" disabled>
                  Selecciona un tag...
                </option>
                {tags
                  .filter((tag) => !formData.tags.includes(tag.name))
                  .map((tag) => (
                    <option key={tag.id} value={tag.name}>
                      {tag.name}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          {/* Reglas dinámicas */}
          <div>
            <label className="label font-bold">Reglas</label>
            {formData.rules.map((rule, index) => (
              <div key={index} className="flex gap-x-2 items-center mb-2">
                <ListTodo />
                <input
                  type="text"
                  value={rule}
                  onChange={(e) => handleListInputChange(e, index, "rules")}
                  className="input input-bordered bg-base-300 w-full"
                />
                <button
                  type="button"
                  className="btn btn-xs btn-error"
                  onClick={() => removeFromList(index, "rules")}
                >
                  ✕
                </button>
              </div>
            ))}
            <button
              type="button"
              className="btn btn-sm btn-outline mt-1"
              onClick={() => addToList("rules")}
            >
              + Añadir regla
            </button>
          </div>

          <div className="flex justify-end mt-4">
            <button
              className={`btn ${isDark ? "btn-accent" : "btn-primary"}`}
              type="submit"
              disabled={loading}
            >
              {loading ? "Actualizando..." : "Guardar cambios"}
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
}

export default EditHackathonModal;

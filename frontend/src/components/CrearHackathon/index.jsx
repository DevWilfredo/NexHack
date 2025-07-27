import { useState, useEffect } from "react";
import { GetTags, CreateHackathon } from "@services";
import ButtonPrimary from "../ButtonPrimary";
import { useAuth } from "@context/AuthContext";

export default function CrearHackathonModal({ onHackathonCreated }) {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [tags, setTags] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    start_date: "",
    end_date: "",
    max_teams: "",
    max_team_members: "",
    rules: [""],
    selectedTags: [],
  });

  useEffect(() => {
    GetTags().then((data) => setTags(data || []));
  }, []);

  if (!user || user.role !== "moderator") return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTagToggle = (id) => {
    setFormData((prev) => {
      const exists = prev.selectedTags.includes(id);
      const updated = exists
        ? prev.selectedTags.filter((tagId) => tagId !== id)
        : [...prev.selectedTags, id];
      return { ...prev, selectedTags: updated };
    });
  };

  const handleRuleChange = (index, value) => {
    const newRules = [...formData.rules];
    newRules[index] = value;
    setFormData((prev) => ({ ...prev, rules: newRules }));
  };

  const addRule = () => {
    setFormData((prev) => ({ ...prev, rules: [...prev.rules, ""] }));
  };

  const removeRule = (index) => {
    const newRules = [...formData.rules];
    newRules.splice(index, 1);
    setFormData((prev) => ({ ...prev, rules: newRules }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      title: formData.title,
      description: formData.description,
      start_date: formData.start_date,
      end_date: formData.end_date,
      max_teams: parseInt(formData.max_teams),
      max_team_members: parseInt(formData.max_team_members),
      tags: formData.selectedTags,
      rules: formData.rules.filter((r) => r.trim() !== ""),
    };

    try {
      await CreateHackathon(payload);
      setIsOpen(false);
    } catch (error) {
      console.error("Error al crear hackathon:", error);
    }
  };

  return (
    <>
      <ButtonPrimary title="+ Crear Hackathon" onClick={() => setIsOpen(true)} />

      {isOpen && (
        <dialog className="modal modal-open">
          <div className="modal-box max-w-3xl">
            <h3 className="font-bold text-lg mb-4">Nuevo Hackathon</h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Título"
                className="input input-bordered w-full"
                required
              />

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Descripción"
                className="textarea textarea-bordered w-full"
              />

              <div className="flex gap-4">
                <input
                  type="date"
                  name="start_date"
                  value={formData.start_date}
                  onChange={handleChange}
                  className="input input-bordered w-full"
                  required
                  min={new Date().toISOString().split("T")[0]}
                />
                <input
                  type="date"
                  name="end_date"
                  value={formData.end_date}
                  onChange={handleChange}
                  className="input input-bordered w-full"
                  required
                  min={formData.start_date || new Date().toISOString().split("T")[0]}
                  disabled={!formData.start_date}
                />
              </div>

              <div className="flex gap-4">
                <input
                  type="number"
                  name="max_teams"
                  value={formData.max_teams}
                  onChange={handleChange}
                  placeholder="Máx. equipos"
                  className="input input-bordered w-full"
                />
                <input
                  type="number"
                  name="max_team_members"
                  value={formData.max_team_members}
                  onChange={handleChange}
                  placeholder="Máx. por equipo"
                  className="input input-bordered w-full"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Tags</label>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <div key={tag.id} className="form-control">
                      <label className="label cursor-pointer gap-2">
                        <input
                          type="checkbox"
                          checked={formData.selectedTags.includes(tag.id)}
                          onChange={() => handleTagToggle(tag.id)}
                          className="checkbox"
                        />
                        <span className="label-text">{tag.name}</span>
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Reglas</label>
                {formData.rules.map((rule, i) => (
                  <div key={i} className="flex items-center gap-2 mb-2">
                    <input
                      type="text"
                      value={rule}
                      onChange={(e) => handleRuleChange(i, e.target.value)}
                      placeholder={`Regla #${i + 1}`}
                      className="input input-bordered w-full"
                    />
                    {i > 0 && (
                      <button
                        type="button"
                        className="btn btn-error btn-sm"
                        onClick={() => removeRule(i)}
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  className="btn btn-outline btn-sm mt-1"
                  onClick={addRule}
                >
                  + Añadir regla
                </button>
              </div>

              <div className="modal-action flex justify-between">
                <button
                  type="button"
                  className="btn"
                  onClick={() => setIsOpen(false)}
                >
                  Cancelar
                </button>
                <ButtonPrimary title="Crear hackathon" type="submit" />
              </div>
            </form>
          </div>
        </dialog>
      )}
    </>
  );
}

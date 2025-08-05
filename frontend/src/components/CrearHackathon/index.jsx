import { useEffect, useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { format } from "date-fns";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import toast from "react-hot-toast";
import { AnimatePresence, motion } from "framer-motion";

import { GetTags, CreateHackathon } from "@services";
import ButtonPrimary from "../ButtonPrimary";
import { useAuth } from "@context/AuthContext";
import { useApp } from "@context/AppContext";
import { useNavigate } from "react-router";

function formatDate(date) {
  return date?.toISOString().split("T")[0];
}

export default function CrearHackathonModal() {
  const { user, userToken } = useAuth();
  const { fetchAllHackathons, fetchMyHackathons } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [tags, setTags] = useState([]);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const tomorrow = new Date();
  const navigate = useNavigate();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      start_date: null,
      end_date: null,
      max_teams: "",
      max_team_members: "",
      rules: [{ value: "" }],
      tags: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "rules",
  });

  const startDate = watch("start_date");

  useEffect(() => {
    GetTags().then((data) => setTags(data || []));
  }, []);

  if (!user || user.role !== "moderator") return null;

  const onSubmit = async (data) => {
    const payload = {
      title: data.title,
      description: data.description,
      start_date: formatDate(data.start_date),
      end_date: formatDate(data.end_date),
      max_teams: parseInt(data.max_teams),
      max_team_members: parseInt(data.max_team_members),
      rules: data.rules.map((r) => r.value).filter((r) => r.trim() !== ""),
      tags: data.tags,
    };

    try {
      const createdHackathon = await CreateHackathon(payload, userToken);

      await fetchAllHackathons();
      await fetchMyHackathons();
      reset();
      setIsOpen(false); // Cierra el modal inmediatamente

      toast.success("Hackathon creado correctamente");

      // Redirige inmediatamente después del toast y cierre del modal
      navigate(`/hackathons/${createdHackathon.id}`);
    } catch (err) {
      console.error("Error al crear hackathon:", err.message);
      toast.error("Hubo un error al crear el hackathon");
    }
  };

  return (
    <>
      <ButtonPrimary
        title="+ Crear Hackathon"
        onClick={() => setIsOpen(true)}
      />

      {isOpen && (
        <dialog className="modal modal-open">
          <div className="modal-box max-w-3xl">
            <h3 className="font-bold text-lg mb-4">Nuevo Hackathon</h3>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <input
                  type="text"
                  placeholder="Título"
                  {...register("title", {
                    required: "El título es obligatorio",
                  })}
                  className={`input input-bordered w-full ${
                    errors.title ? "input-error" : ""
                  }`}
                />
                {errors.title && (
                  <p className="text-error text-sm mt-1">
                    {errors.title.message}
                  </p>
                )}
              </div>

              <div>
                <textarea
                  placeholder="Descripción"
                  {...register("description")}
                  className="textarea textarea-bordered w-full"
                />
              </div>

              <div className="flex flex-col md:flex-row gap-4">
                {/* Fecha de inicio */}
                <Controller
                  control={control}
                  name="start_date"
                  rules={{ required: "La fecha de inicio es obligatoria" }}
                  render={({ field }) => (
                    <div className="w-full relative">
                      <label className="block text-sm font-medium mb-1">
                        Fecha de inicio
                      </label>
                      <input
                        readOnly
                        value={
                          field.value ? format(field.value, "yyyy-MM-dd") : ""
                        }
                        onClick={() => {
                          setShowStartPicker((prev) => {
                            if (!prev) setShowEndPicker(false);
                            return !prev;
                          });
                        }}
                        className={`input input-bordered w-full ${
                          errors.start_date ? "input-error" : ""
                        }`}
                        placeholder="Selecciona fecha"
                      />
                      {showStartPicker && (
                        <div className="absolute z-10 mt-2 rounded-md p-4 bg-base-200 shadow-lg shadow-primary/30">
                          <DayPicker
                            mode="single"
                            selected={field.value}
                            onSelect={(date) => {
                              field.onChange(date);
                              setShowStartPicker(false);
                            }}
                            disabled={{ before: new Date() }}
                          />
                        </div>
                      )}
                      {errors.start_date && (
                        <p className="text-error text-sm mt-1">
                          {errors.start_date.message}
                        </p>
                      )}
                    </div>
                  )}
                />

                {/* Fecha de cierre */}
                <Controller
                  control={control}
                  name="end_date"
                  rules={{ required: "La fecha de cierre es obligatoria" }}
                  render={({ field }) => (
                    <div className="w-full relative">
                      <label className="block text-sm font-medium mb-1">
                        Fecha de cierre
                      </label>
                      <input
                        readOnly
                        value={
                          field.value ? format(field.value, "yyyy-MM-dd") : ""
                        }
                        onClick={() => {
                          if (!startDate) {
                            toast.error(
                              "Primero selecciona la fecha de inicio"
                            );
                            return;
                          }

                          setShowEndPicker((prev) => {
                            if (!prev) setShowStartPicker(false);
                            return !prev;
                          });
                        }}
                        className={`input input-bordered w-full ${
                          errors.end_date ? "input-error" : ""
                        }`}
                        placeholder="Selecciona fecha"
                      />
                      {showEndPicker && (
                        <div className="absolute z-10 mt-2 rounded-md p-4 bg-base-200 shadow-lg shadow-primary/30">
                          <DayPicker
                            mode="single"
                            selected={field.value}
                            onSelect={(date) => {
                              field.onChange(date);
                              setShowEndPicker(false);
                            }}
                            disabled={{
                              before: startDate
                                ? new Date(
                                    new Date(startDate).setDate(
                                      new Date(startDate).getDate() + 1
                                    )
                                  )
                                : tomorrow,
                            }}
                          />
                        </div>
                      )}
                      {errors.end_date && (
                        <p className="text-error text-sm mt-1">
                          {errors.end_date.message}
                        </p>
                      )}
                    </div>
                  )}
                />
              </div>

              <div className="flex gap-4">
                <div className="w-full">
                  <input
                    type="number"
                    placeholder="Máx. equipos"
                    {...register("max_teams", {
                      required: "Este campo es obligatorio",
                      min: { value: 1, message: "Debe ser al menos 1" },
                    })}
                    className={`input input-bordered w-full ${
                      errors.max_teams ? "input-error" : ""
                    }`}
                  />
                  {errors.max_teams && (
                    <p className="text-error text-sm mt-1">
                      {errors.max_teams.message}
                    </p>
                  )}
                </div>

                <div className="w-full">
                  <input
                    type="number"
                    placeholder="Máx. por equipo"
                    {...register("max_team_members", {
                      required: "Este campo es obligatorio",
                      min: { value: 1, message: "Debe ser al menos 1" },
                    })}
                    className={`input input-bordered w-full ${
                      errors.max_team_members ? "input-error" : ""
                    }`}
                  />
                  {errors.max_team_members && (
                    <p className="text-error text-sm mt-1">
                      {errors.max_team_members.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Tags</label>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <label key={tag.id} className="label cursor-pointer gap-2">
                      <input
                        type="checkbox"
                        value={tag.name}
                        {...register("tags")}
                        className="checkbox"
                      />
                      <span className="label-text">{tag.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Reglas</label>
                <AnimatePresence>
                  {fields.map((field, index) => (
                    <motion.div
                      key={field.id}
                      className="flex items-center gap-2 mb-2"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                    >
                      <input
                        {...register(`rules.${index}.value`)}
                        placeholder={`Regla #${index + 1}`}
                        className="input input-bordered w-full mt-4"
                      />
                      {index > 0 && (
                        <button
                          type="button"
                          className="btn btn-error btn-sm mt-4"
                          onClick={() => remove(index)}
                        >
                          ✕
                        </button>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>

                <button
                  type="button"
                  className="btn btn-outline btn-sm mt-1"
                  onClick={() => append({ value: "" })}
                >
                  + Añadir regla
                </button>
              </div>

              <div className="modal-action flex justify-between">
                <button
                  type="button"
                  className="btn"
                  onClick={() => {
                    setIsOpen(false);
                    reset();
                  }}
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

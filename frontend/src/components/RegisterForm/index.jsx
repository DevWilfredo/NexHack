import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useAuth } from "@context/AuthContext";
import InputComponent from "@components/InputComponent";
import CheckboxComponent from "@components/Checkbox";
import ButtonPrimary from "@components/ButtonPrimary";
import { Link } from "react-router";
import { motion } from "framer-motion";

const RegisterFormComponent = () => {
  const { register: registerUser } = useAuth();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      await registerUser(
        data.nombre,
        data.apellidos,
        data.username,
        data.password
      );
    } catch (err) {
      toast.error(err.message || "Error al registrarse.");
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-base-200 p-8 rounded-lg shadow-lg w-full max-w-md"
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <h2 className="text-2xl font-bold text-center mb-6">
        Registro de usuario
      </h2>

      <InputComponent
        label="Nombre"
        name="nombre"
        placeholder="Pepito"
        register={register}
        error={errors.nombre}
        rules={{ required: "El nombre es obligatorio." }}
      />

      <InputComponent
        label="Apellidos"
        name="apellidos"
        placeholder="Apellido"
        register={register}
        error={errors.apellidos}
        rules={{ required: "Los apellidos son obligatorios." }}
      />

      <InputComponent
        label="Correo electrónico"
        name="username"
        type="email"
        placeholder="ejemplo@correo.com"
        register={register}
        error={errors.username}
        rules={{
          required: "El correo electrónico es obligatorio.",
          pattern: {
            value: /^\S+@\S+\.\S+$/,
            message: "Correo electrónico no válido.",
          },
        }}
      />

      <InputComponent
        label="Contraseña"
        name="password"
        type="password"
        placeholder="*******"
        register={register}
        error={errors.password}
        rules={{
          required: "La contraseña es obligatoria.",
          minLength: {
            value: 6,
            message: "La contraseña debe tener al menos 6 caracteres.",
          },
        }}
      />

      <InputComponent
        label="Confirmar contraseña"
        name="confirmPassword"
        type="password"
        placeholder="*******"
        register={register}
        error={errors.confirmPassword}
        rules={{
          required: "Confirma tu contraseña.",
          validate: (value) =>
            value === watch("password") || "Las contraseñas no coinciden.",
        }}
      />

      <div className="flex items-center mt-3">
        <CheckboxComponent
          label={
            <>
              Acepto los{" "}
              <a href="#" className="text-primary hover:underline">
                Términos y Condiciones
              </a>
            </>
          }
          name="terms"
          register={register}
          error={errors.terms}
          rules={{ required: "Debes aceptar los términos" }}
        />
      </div>

      <div className="mt-6">
        <ButtonPrimary title="Registrarse" type="submit" className="w-full" />
      </div>

      <p className="text-center text-sm text-base-content mt-4">
        ¿Ya tienes Cuenta?{" "}
        <Link to="/login" className="text-primary font-semibold hover:underline">
          Inicia Sesion
        </Link>
      </p>
    </motion.form>
  );
};

export default RegisterFormComponent;

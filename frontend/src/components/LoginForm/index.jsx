import React from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router";
import { useAuth } from "@context/AuthContext";
import ButtonPrimary from "@components/ButtonPrimary";
import InputComponent from "@components/InputComponent";
import CheckboxComponent from "@components/Checkbox";
import { motion } from "framer-motion";

const LoginFormComponent = () => {
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = (data) => {
    login(data.email, data.password);
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
      <h2 className="text-3xl font-extrabold text-center mb-6">
        Iniciar sesión
      </h2>

      <InputComponent
        label="Correo electrónico"
        name="email"
        type="email"
        placeholder="ejemplo@correo.com"
        register={register}
        error={errors.email}
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

      <div className="flex items-center mt-3">
        <CheckboxComponent
          label="Recuérdame"
          name="rememberMe"
          register={register}
          error={errors.rememberMe}
          rules={{}}
        />
      </div>

      <ButtonPrimary
        title={isSubmitting ? "Entrando..." : "Entrar"}
        type="submit"
        disabled={isSubmitting}
        className="w-full"
      />

      <p className="text-center text-sm text-base-content mt-4">
        ¿No tienes cuenta?{" "}
        <Link
          to="/register"
          className="text-primary font-semibold hover:underline"
        >
          Regístrate
        </Link>
      </p>
    </motion.form>
  );
};

export default LoginFormComponent;

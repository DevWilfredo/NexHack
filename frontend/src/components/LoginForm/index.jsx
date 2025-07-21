import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { toast } from "react-hot-toast";
import { Link } from "react-router";
import { useAuth } from "@context/AuthContext";
import { useTheme } from "@context/ThemeContext";
import ButtonPrimary from "@components/ButtonPrimary";
import InputComponent from "@components/InputComponent";
import CheckboxComponent from "@components/Checkbox";

const LoginFormComponent = () => {
  const { login } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = (data) => {
    login(
      data.email,
      data.password,
    );
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={`${
        isDark ? "bg-slate-900/80" : "bg-base-200"
      } p-8 rounded-lg shadow-lg w-full max-w-md`}
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

      <div className="flex items-center">
        <CheckboxComponent
          label="Recuérdame"
          name="rememberMe"
          register={register}
          error={errors.rememberMe}
          rules={{}}
          isDark={isDark}
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
          className={`${
            isDark ? "text-red-600" : "text-primary"
          } font-semibold hover:underline`}
        >
          Regístrate
        </Link>
      </p>
    </form>
  );
};

export default LoginFormComponent;

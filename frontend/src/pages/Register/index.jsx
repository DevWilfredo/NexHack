import React, { useState } from "react";
import InputComponent from "@components/Input";
import ButtonPrimary from "@components/ButtonPrimary";
import { useAuth } from "@context/AuthContext";

const Register = () => {
  const { register } = useAuth();
  const [form, setForm] = useState({
    nombre: "",
    apellidos: "",
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !form.nombre ||
      !form.apellidos ||
      !form.username ||
      !form.password ||
      !form.confirmPassword
    ) {
      setError("Por favor, completa todos los campos.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setError("");

    register(form.nombre, form.apellidos, form.username, form.password)
      .catch((err) => {
        setError(err.message || "Error al registrarse.");
      });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <form
        onSubmit={handleSubmit}
        className="p-6 rounded-md w-full max-w-md space-y-4"
      >
        <h2 className="text-2xl text-center font-semibold">Registro de usuario</h2>

        <InputComponent
          label="Nombre"
          name="nombre"
          placeholder="Pepito"
          value={form.nombre}
          onChange={handleChange}
        />

        <InputComponent
          label="Apellidos"
          name="apellidos"
          placeholder="Apellido"
          value={form.apellidos}
          onChange={handleChange}
        />

        <InputComponent
          label="Correo electrónico"
          name="username"
          placeholder="ejemplo@correo.com"
          value={form.username}
          onChange={handleChange}
        />

        <InputComponent
          label="Contraseña"
          type="password"
          name="password"
          placeholder="*******"
          value={form.password}
          onChange={handleChange}
        />

        <InputComponent
          label="Confirmar contraseña"
          type="password"
          name="confirmPassword"
          placeholder="*******"
          value={form.confirmPassword}
          onChange={handleChange}
        />

        {error && <p className="text-sm text-center text-red-500">{error}</p>}

        <div className="pt-2">
          <ButtonPrimary title="Registrarse" type="submit" />
        </div>
      </form>
    </div>
  );
};

export default Register;

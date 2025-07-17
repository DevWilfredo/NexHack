import React, { useState } from "react";
import ButtonPrimary from "../../components/ButtonPrimary";
import Input from "../../components/Input";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (form.email === "" || form.password === "") {
      setError("Por favor, completa todos los campos.");
    } else {
      setError("");
      console.log("Formulario enviado:", form);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-base-200">
      <form
        onSubmit={handleSubmit}
        className="bg-base-100 p-6 rounded shadow-md w-80 space-y-4"
      >
        <h2 className="text-2xl font-bold text-center">Iniciar sesión</h2>

        <Input
          name="email"
          type="email"
          placeholder="Correo electrónico"
          value={form.email}
          onChange={handleChange}
        />

        <Input
          name="password"
          type="password"
          placeholder="Contraseña"
          value={form.password}
          onChange={handleChange}
        />

        {error && <p className="text-sm text-center">{error}</p>}

        <ButtonPrimary title="Entrar" type="submit" />
      </form>
    </div>
  );
};

export default Login;

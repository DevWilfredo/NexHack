import React, {useState} from "react";
import InputComponent from "../../components/Input";
import ButtonPrimary from "../../components/ButtonPrimary";

const Register = () => {
  const [form, setForm] = useState({
    nombre: "",
    apellidos:"",
    username:"",
    password:"",
    confirmPassword:"",
  })

  const [error, setError] = useState("")

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value})
  }

  const handleSubmit =(e)=>{
    e.preventDefault()

    if(
      !form.nombre ||
      !form.apellidos||
      !form.username||
      !form.password ||
      !form.confirmPassword  
    ){
      setError("Portfavor, completa todos los campos.")
      return;
    }
    if(form.password !== form.confirmPassword){
      setError("Las contraseñas nocoinciden.")
      return
    }

    setError("")
    console.log("Datos de registro:", form)
  }
  return <div className="flex flex-col items-center justify-center min-h-screen">
    <form
      onSubmit={handleSubmit}
      className="p-6 rounded-md w-full max-w-md space-y-4">
      <h2 className="text-2x1 text-center">Registro de usuario</h2>

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
      placeholder="Ape LLidos"
      value={form.apellidos}
      onChange={handleChange}
      />

      <InputComponent
      label="Nombre de Usuario"
      name="username"
      placeholder="username"
      value={form.username}
      onChange={handleChange}
      />
      <InputComponent
      label="Contraseña"
      type = "password"
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
        {error && <p className="text-sm text-center">{error}</p>}

      <div className="pt-2">
        <ButtonPrimary title="Registrarse" type="submit"/>
      </div>
    </form>
  </div>
};

export default Register;

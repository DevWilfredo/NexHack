const API_URL = import.meta.env.VITE_API_URL

export const GetTags = () => {
  return fetch(`${API_URL}/tags`)
    .then((response) => {
      return response.json();
    })
    .catch((error) => {
      console.error("Error fetching tags:", error);
    });
}

export const GetHackathons = () => {
  return fetch(`${API_URL}/hackathons`)
    .then((response) => {
      return response.json();
    })
    .catch((error) => {
      console.error("Error fetching tags:", error);
    });
}

export const GetUserProfile = (id,token) => {
  return fetch(`${API_URL}/users/${id}`,{
          headers: {
        Authorization: `Bearer ${token}`, // JWT
      }
})
    .then((response) => {
      return response.json();
    })
}

export const LoginUser = (email, password) => {
  return fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  }).then(res => res.json());
};

export const RegisterUser = (firstname, lastname, email, password) => {
  return fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ firstname, lastname, email, password }),
  })
    .then(async (res) => {
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Error en el registro");
      }
      return data; 
    });
};


//Update perfil con token ya funcional.
export const updateUserProfile = async (userId, updatedData, token) => {
  const formData = new FormData();
  formData.append("firstname", updatedData.firstname);
  formData.append("lastname", updatedData.lastname);
  formData.append("email", updatedData.email); 

  if (updatedData.avatarFile) {
    formData.append("file", updatedData.avatarFile);
  }

  try {
    const response = await fetch(`http://localhost:5000/api/v1/users/${userId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`, // JWT
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Error updating profile");
    }

    return await response.json(); // Devuelve el usuario actualizado
  } catch (error) {
    throw error;
  }
};
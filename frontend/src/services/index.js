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
    const response = await fetch(`${API_URL}/users/${userId}`, {
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

//prueba de conseguir Teams especifico 
export const getTeamByHackathon = async ({ teamId, hackathonId, token }) => {
  try {
    console.log(teamId, hackathonId, token);
    const response = await fetch(
      `${API_URL}/teams/${teamId}/hackathons/${hackathonId}`,
      {
        method: "GET",
         headers: {
        Authorization: `Bearer ${token}`, // JWT
      },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Error al obtener el equipo");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error en getTeamByHackathon:", error.message);
    throw error;
  }
};

//postman
export const postmanTry = (teamId, hackathonId, userToken) => {
  const myHeaders = new Headers();
  myHeaders.append(`Authorization`, `Bearer ${userToken}`);
  
  const requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow"
  };
  
  fetch(  `${API_URL}/teams/${teamId}/hackathons/${hackathonId}`, requestOptions)
  .then((response) =>{ return response.json()})
  .then((result) => console.log(result))
  .catch((error) => console.error(error));
  
}
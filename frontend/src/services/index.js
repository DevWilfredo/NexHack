const API_URL = import.meta.env.VITE_API_URL
const headers = {'Content-Type': "application/json"}

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

  // Nuevos campos
  formData.append("bio", updatedData.bio || "");
  formData.append("website_url", updatedData.website_url || "");
  formData.append("github_url", updatedData.github_url || "");
  formData.append("linkedin_url", updatedData.linkedin_url || "");

  if (updatedData.avatarFile) {
    formData.append("file", updatedData.avatarFile);
  }

  try {
    const response = await fetch(`${API_URL}/users/${userId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Error actualizando perfil");
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};

//prueba de conseguir Teams especifico 
export const getTeamByHackathon = async ({ teamId, hackathonId, token }) => {
  try {
   
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

//intento por el camino largo, primero el hackathon, de ahi la info de teams
export const fetchSingleHackathon = async (hackathonId,token) => {
  try {
    const response = await fetch(`http://127.0.0.1:5000/api/v1/hackathons/${hackathonId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) throw new Error("Error al obtener hackathon");

    const data = await response.json();
    
    return data;

  } catch (error) {
    console.error("Error al buscar equipo:", error);
    return null;
  }
};

export const getUsers = async (token) => {
  try {
    const response = await fetch(`${API_URL}/users/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) throw new Error("Error al obtener usuarios");

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al buscar equipo:", error);
    return null;
  }
};

export const SendInvitation = async (userToken, teamId,toUserId, teamName) =>{
  try{
   
    const response = await fetch(`${API_URL}/teams/${teamId}/invite`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${userToken}`,
        'Content-Type': "application/json",
      }
      ,
       body: JSON.stringify({
    "user_id": toUserId,
   
  }),
      
    });
    const data = await response.json();
    console.log(data);
    if (!response.ok) throw new Error("Error al enviar invitación");
    
    return data;
  }catch(error){
    throw new Error("Error al buscar equipo:", error);
    return null;
  }
}


export const EditTeam = async (team, token) =>{
  const toSend = {
    name: team.name,
    github_url: team.github_url,
    live_preview_url: team.live_preview_url,
    bio: team.bio
  }
  
 
  try{
    const response = await fetch(`${API_URL}/teams/${team.hackathon_id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': "application/json",
      },
      body: JSON.stringify(toSend),
    });
    const data = await response.json();
    
    if (!response.ok) throw new Error("Error al enviar invitación");
    
    return data;
  }catch(error){
    throw new Error("Error al buscar equipo:", error);   
  }
}

export const getUserNotifications = async (token) => {
  try {
    const response = await fetch(`${API_URL}/notifications`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!response.ok) throw new Error("Error al obtener notificaciones");

    return await response.json();
  } catch (error) {
    console.error("Error al cargar notificaciones:", error);
    return [];
  }
};

export const markNotificationAsRead = async (notificationId, token) => {
  try {
    const response = await fetch(`${API_URL}/notifications/${notificationId}/read`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': "application/json"
      }
    });

    if (!response.ok) throw new Error("Error al marcar notificación como leída");
    return await response.json();
  } catch (error) {
    console.error("Error en markNotificationAsRead:", error);
    throw error;
  }
};


//solicitar unirme al grupo
export const SendRequest = async (userToken, teamId)=>{
  try{
    const response = await fetch(`${API_URL}/teams/${teamId}/request`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });
    const data = await response.json();
    console.log(data);
    if (!response.ok) throw new Error("Error al enviar invitación");
    return data;
  }
  catch(error){
    throw new Error("Error al buscar equipo:", error);
  }
}

export const HandleInvitation= async (userToken, requestID, action)=>{
  try{
    const response = await fetch(`${API_URL}/teams/requests/${requestID}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${userToken}`,
        'Content-Type': "application/json",
      },
      body: JSON.stringify({
        "action": action
      }),
    });
    const data = await response.json();
    console.log(data);
    if (!response.ok) throw new Error("Error al enviar invitación");
    return data;
  }
  catch(error){
    throw new Error("Error al buscar equipo:", error);
  }
}

//Obtener Hackathons de Usuario logueado
export const getMyHackathons = async (token) => {
  try {
    const res = await fetch(`${API_URL}/users/my-hackathons`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Error fetching my hackathons", err);
    return null;
  }
};


export const fetchUserRequests = async (token) => {
  try {
    const response = await fetch(`${API_URL}/teams/requests/me`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener las solicitudes');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error en fetchUserRequests:", error);
    return [];
  }
};
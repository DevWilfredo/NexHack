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

export const GetUserProfile = (id) => {
  return fetch(`${API_URL}/users/${id}`)
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


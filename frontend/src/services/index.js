const API_URL = import.meta.env.VITE_API_URL

export const GetTags=() =>{
     return fetch(`${API_URL}/tags`)
      .then((response) => {
      return response.json();
    })     
      .catch((error) => {
        console.error("Error fetching tags:", error);
      });
}

export const GetHackathons=() =>{
     return fetch(`${API_URL}/hackathons`)
      .then((response) => {
      return response.json();
    })     
      .catch((error) => {
        console.error("Error fetching tags:", error);
      });
}

export const GetUserProfile=(id)=>{
        return fetch(`${API_URL}/users/${id}`)
        .then((response) => {
        return response.json();
      })
    }
       
export const GetTags=() =>{
     return fetch("http://127.0.0.1:5000/api/v1/tags")
      .then((response) => {
      return response.json();
    })     
      .catch((error) => {
        console.error("Error fetching tags:", error);
      });
}

export const GetHackathons=() =>{
     return fetch("http://127.0.0.1:5000/api/v1/hackathons")
      .then((response) => {
      return response.json();
    })     
      .catch((error) => {
        console.error("Error fetching tags:", error);
      });
}

export const GetUserProfile=(id)=>{
        return fetch(`http://127.0.0.1:5000/api/v1/users/${id}`)
        .then((response) => {
        return response.json();
      })
    }
       
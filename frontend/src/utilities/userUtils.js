import { getTeamByHackathon, SendRequest, HandleInvitation } from "../services";
import toast from "react-hot-toast"; 

// ✅ Función para aceptar o rechazar solicitudes o invitaciones
export function AcceptorReject(userToken, refreshTeamData) {
  return (action, requestID) => {
    HandleInvitation(userToken, requestID, action)
      .then(() => {
        refreshTeamData();
        if (action.trim().toLowerCase() === "accept") {
          toast.success("Invitación aceptada");
        } else {
          toast.error("Invitación rechazada");
        }
      })
      .catch((error) => {
        toast.error("Error al procesar la solicitud");
        console.error("Error en AcceptorReject:", error);
      });
  };
}
// ✅ verifica si ya participa en el hackathon
export function isInHackathon(hackathonData, user) {
  
  return hackathonData.teams.some((teams) => teams.members.some((member) => member.user.id === user.id)
  );
}


//  ✅ Función para cancelar invitaciones
export function HandleCancelInvitation(userToken, hackathonId, teamId, setTeamData) {
  return async (requestId) => {
    await DeleteInvitation(userToken, requestId);

    refreshTeamData(hackathonId, teamId, userToken, setTeamData)();
  };
}


// ✅ Funcion para eliminar una invitacion enviada, luego del PR pasar a services el fetch, cambiar el localhost a ${API_URL}
export async function DeleteInvitation(userToken, requestID) {
  try {
    const response = await fetch(`http://127.0.0.1:5000/api/v1/teams/requests/${requestID}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });
    
    if (!response.ok) throw new Error("Error al eliminar invitación");
    
    toast.success("Invitación eliminada");
  } catch (error) {
    toast.error("Error al eliminar invitación");
    console.error("Error al eliminar invitación:", error);
  }
}


// ✅ Función para unirse a un equipo
export function JoinTeam(userToken, teamId, setDisabledButton) {
  return () => {
    SendRequest(userToken, teamId)
      .then(() => {
        toast.success("Solicitud enviada");
        setDisabledButton((prev) => ({
          ...prev,
          disable: true,
          message: "Solicitud enviada",
        }));
      })
      .catch((error) => {
        toast.error("Error al enviar solicitud");
        console.error("Error en JoinTeam:", error);
      });
  };
}

// ✅ Función para refrescar los datos del equipo
export function refreshTeamData(hackathonId, teamId, userToken, setTeamData) {
  return () => {
    if (hackathonId && teamId && userToken) {
      getTeamByHackathon({ teamId, hackathonId, token: userToken })
        .then((res) => {
          setTeamData(res);
        })
        .catch((error) =>
          console.error("Error al obtener datos del equipo:", error)
        );
    }
  };
}

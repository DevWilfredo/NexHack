import React, { useEffect, useState } from "react";
import { useAuth } from "@context/AuthContext"; // 👈 IMPORTANTE
import { GetUserProfile } from "@services/";
import ModalUserUpdateComponent from "../ModalUserUpdate";

function UserProfileComponent() {
  const { userToken } = useAuth(); // 👈 obtenemos el token del contexto
  const [userInfo, setUserInfo] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [userLoaded, setUserLoaded] = useState(false);

  useEffect(() => {
    const userId = 1;
    if (!userToken) return;

    GetUserProfile(userId, userToken).then((data) => {
      setUserInfo(data);
      setUserLoaded(true);
    });
  }, [userToken]); // 👈 escucha los cambios del token

  const handleModal = () => setShowModal((prev) => !prev);

  const handleUpdate = (updatedData) => {
    setUserInfo(updatedData);
  };

  return (
    <div className="flex justify-center">
      <div className="basis-64 items-center gap-4">
        <img
          src={
            userInfo.profile_picture
              ? `${import.meta.env.VITE_API_URL}/users/profile_pictures/${
                  userInfo.profile_picture
                }`
              : `https://placehold.co/400x400?text=${
                  userInfo.firstname?.charAt(0)?.toUpperCase() || "U"
                }`
          }
          alt="Avatar"
          className="w-24 h-24 rounded-full"
        />

        <div>
          <h1 className="text-2xl font-bold">
            {`${userInfo.firstname} ${userInfo.lastname}`}
          </h1>
          <p className="text-sm text-gray-500">@{userInfo.username}</p>
          <button
            className="btn btn-sm mt-2 btn-outline ml-auto"
            onClick={handleModal}
          >
            Edit Profile
          </button>
          <p className="mt-2">{userInfo.bio}</p>
        </div>
      </div>

      <ModalUserUpdateComponent
        showModal={showModal}
        onClose={handleModal}
        user={userInfo}
        onUpdate={handleUpdate}
      />
    </div>
  );
}

export default UserProfileComponent;

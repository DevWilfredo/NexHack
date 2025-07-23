import { UserPlus } from "lucide-react";

const UserToListcomponent = (index, us, HandleInvitation) => {
  return (
    <div
      key={index}
      className={` card rounded-box p-3  my-2 ${
        index % 2 === 0
          ? "shadow-md border-primary border-1 shadow-primary"
          : " shadow-md border-accent border-1 shadow-accent"
      }     hover:bg-primary cursor-pointer`}
    >
      <div className="flex justify-between  w-full ">
        <div className="flex items-center space-x-4">
          <img
            src={
              us.profile_picture
                ? `${import.meta.env.VITE_API_URL}/users/profile_pictures/${
                    us.profile_picture
                  }`
                : `https://placehold.co/400x400?text=${
                    us.firstname?.charAt(0)?.toUpperCase() || "U"
                  }`
            }
            className="w-8 h-8 rounded-full"
          />
          <p>
            {us.firstname} {us.lastname}
          </p>
        </div>
        <div className=" px-4 hover:text-success">
          <button
            className="btn btn-ghost"
            onClick={() => HandleInvitation(us.id)}
          >
            <UserPlus />
          </button>
        </div>
      </div>
    </div>
  );
};
export default UserToListcomponent;

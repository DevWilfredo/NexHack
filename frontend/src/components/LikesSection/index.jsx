import React from "react";
import { Trophy, User } from "lucide-react";
import { format } from "date-fns";

function LikesSection({ likes }) {
  return (
    <ul className="space-y-4">
      {likes.map((like, index) => (
        <li
          key={index}
          className="p-4 rounded-xl bg-base-200 shadow-sm hover:shadow-md transition"
        >
          <div className="flex items-center gap-4">
            <img
              src={
                like.profile_picture
                  ? `${import.meta.env.VITE_API_URL}/users/profile_pictures/${like.profile_picture}`
                  : `https://placehold.co/100x100?text=${like.fullName?.charAt(0) || "U"}`
              }
              alt={like.fullName}
              className="w-14 h-14 rounded-full object-cover"
            />

            <div className="flex-1">
              <h3 className="text-lg font-semibold">{like.fullName}</h3>
              <p className="text-sm text-gray-500">{like.bio}</p>
              <p className="text-xs text-gray-400">
                {like.username} te dejó un like el{" "}
                {format(new Date(like.likedAt), "dd MMM yyyy")}
              </p>
              <a
                href={`/profile/${like.username}`}
                className="btn btn-sm btn-primary border border-primary/10 mt-4"
              >
                <User size={16} className="mr-1" />
                Ver perfil
              </a>
            </div>

            <div className="flex flex-col items-end">
              <span className="badge badge-primary mb-1 p-2">
                <Trophy className="mr-1 h-5 w-5 text-yellow-600" fill="currentColor" />
                {like.points} pts
              </span>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default LikesSection;

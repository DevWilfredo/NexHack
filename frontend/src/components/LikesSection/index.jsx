import React from "react";
import { motion } from "framer-motion";
import { Trophy, User, ThumbsUp } from "lucide-react";
import { format } from "date-fns";

function LikesSection({ likes }) {
  return (
    <motion.div
      key="likes-section"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="space-y-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <ThumbsUp className="text-success" />
          Usuarios que te han dado Like
        </h2>

        {likes.length === 0 ? (
          <div className="text-center text-base-content/60 py-10 flex flex-col items-center gap-4">
            <User size={48} className="text-base-content/30" />
            <p className="text-lg">Aún no has recibido likes de otros usuarios.</p>
            <p className="text-sm text-base-content/50">
              ¡Colabora en más hackathons para conectar con otros!
            </p>
          </div>
        ) : (
          <ul className="space-y-4">
            {likes.map((like, index) => (
              <li
                key={index}
                className="p-4 rounded-xl bg-base-200 shadow-sm hover:shadow-md transition"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={
                      like.from_user.profile_picture
                        ? `${import.meta.env.VITE_API_URL}/users/profile_pictures/${like.from_user.profile_picture}`
                        : `https://placehold.co/100x100?text=${like.from_user.firstname?.charAt(0) || "U"}`
                    }
                    alt={`${like.from_user.firstname} ${like.from_user.lastname}`}
                    className="w-14 h-14 rounded-full object-cover"
                  />

                  <div className="flex-1">
                    <h3 className="text-lg font-semibold">
                      {like.from_user.firstname} {like.from_user.lastname}
                    </h3>
                    <p className="text-sm text-gray-500">{like.from_user.bio}</p>
                    <p className="text-xs text-gray-400">
                      {like.from_user.username} te dejó un like el{" "}
                      {format(new Date(like.created_at), "dd MMM yyyy")}
                    </p>
                    <a
                      href={`/profile/${like.from_user.id}`}
                      className="btn btn-sm btn-primary border border-primary/10 mt-4"
                    >
                      <User size={16} className="mr-1" />
                      Ver perfil
                    </a>
                  </div>

                  <div className="flex flex-col items-end">
                    <span className="badge badge-primary mb-1 p-2">
                      <Trophy
                        className="mr-1 h-5 w-5 text-yellow-600"
                        fill="currentColor"
                      />
                      {like.from_user.points} pts
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </motion.div>
  );
}

export default LikesSection;

import React from "react";
import { FaHeart, FaRegComment, FaBookmark } from "react-icons/fa";

interface Bookmark {
  id: string;
  postId: string;
  userId: string;
  createdAt: Date;
  Post: {
    id: string;
    image: string | null;
    content: string;
    author: {
      name: string | null;
      image: string | null;
    };
  };
}

const BookMark = ({ bookMark }: { bookMark: Bookmark }) => {
  if (!bookMark || !bookMark.Post) return null;

  const author = bookMark.Post.author?.name ?? "Unknown";
  const imgsrc =
    bookMark.Post.image ??
    "https://via.placeholder.com/600x600?text=No+Image";
  const authorImg = bookMark.Post.author.image ?? "/default-avatar.png";
  const content = bookMark.Post.content ?? "";
  const formattedDate = new Date(bookMark.createdAt).toDateString();

  return (
    <div className="bg-black text-white max-w-lg mx-auto rounded-lg shadow-md p-4">
      {/* Header: User Info */}
      <div className="flex items-center gap-3">
        <img
          src={authorImg}
          alt="Author"
          className="w-10 h-10 object-cover rounded-full border"
        />
        <div>
          <span className="font-semibold">{author}</span>
          <span className="text-gray-400 text-sm ml-2">• {formattedDate}</span>
        </div>
      </div>

      {/* Post Content */}
      <p className="mt-2">{content}</p>

      {/* Full-width Post Image */}
      <div className="mt-3">
        <img
          src={imgsrc}
          alt="Post"
          className="w-full object-cover rounded-lg"
        />
      </div>

      {/* Footer: Icons */}
      <div className="flex justify-between items-center mt-3 text-gray-400">
        <div className="flex gap-4">
          <FaHeart className="cursor-pointer hover:text-red-500" />
          <FaRegComment className="cursor-pointer hover:text-gray-300" />
        </div>
        <FaBookmark className="cursor-pointer hover:text-gray-300" />
      </div>
    </div>
  );
};

export default BookMark;

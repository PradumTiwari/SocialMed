import React, { useEffect, useRef } from "react";
import { Avatar, AvatarImage } from "./avatar";
import Link from "next/link";

interface Follower {
  id: string;
  image: string;
  name: string;
  username:string;
}

interface ModalProps {
  onClose: () => void;
  followers: Follower[];
  isLoading: boolean;
}

const Modal: React.FC<ModalProps> = ({ onClose, followers, isLoading }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Close modal if clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div ref={modalRef} className="bg-white p-5 rounded-lg w-96 shadow-lg">
        <h2 className="text-lg font-semibold text-gray-800">Following</h2>

        {/* Scrollable List */}
        <div className="mt-4 max-h-72 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          {isLoading ? (
            // Shimmer effect while loading
            [...Array(5)].map((_, index) => (
              <div key={index} className="flex items-center space-x-3 animate-pulse p-2">
                <div className="w-12 h-12 rounded-full bg-gray-300"></div>
                <div className="flex flex-col space-y-2">
                  <div className="w-32 h-4 bg-gray-300 rounded"></div>
                  <div className="w-24 h-3 bg-gray-300 rounded"></div>
                </div>
              </div>
            ))
          ) : followers.length > 0 ? (
            followers.map((follower) => (
                <div  key={follower.id}>
                <Link href={`/profile/${follower.username}`}>
              <div className="flex items-center space-x-3 p-2 hover:bg-gray-100 rounded-lg">
                <Avatar className="w-12 h-12">
                  <AvatarImage 
                    src={follower.image && follower.image.startsWith("http") ? follower.image : "/default-avatar.png"}
                    alt={follower.name}
                  />
                </Avatar>
                <div>
                  <p className="font-medium text-gray-900">{follower.name}</p>
                </div>
              </div>
              </Link>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">No followers found</p>
          )}
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="mt-4 w-full py-2 bg-gray-200 hover:bg-gray-300 rounded text-gray-800 font-medium"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default Modal;

"use client";
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "./ui/card";
import Link from "next/link";
import { LinkIcon, MapPinIcon } from "lucide-react";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Separator } from "./ui/separator";
import { getFollowers, getFollowing } from "@/actions/user.action";
import Modal from "./ui/modal";

interface User {
  id: string;
  email: string;
  username: string;
  clerkId: string;
  name: string | null;
  bio: string | null;
  image: string | null;
  location: string | null;
  website: string | null;
  createdAt: string;
  updatedAt: string;
  _count: {
    followers: number;
    following: number;
    posts: number;
  };
}

const SideBarClient = ({ user }: { user: User }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [followers, setFollowers] = useState<{ id: string; name: string; image: string; username: string }[]>([]);
  const [following, setFollowing] = useState<{ id: string; name: string; image: string; username: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showFollowers, setShowFollowers] = useState(true);

  useEffect(() => {
    const fetchFollowing = async () => {
       setIsLoading(true);

      try {
        const data = await getFollowing();
        const datafollower=await getFollowers()||[];
       
        const followingTable = data?.following || [];

      
        setFollowing(
          followingTable.map((f) => ({
            id: f.following?.id ?? "", // The user whom the current user follows
            name: f.following?.name ?? "Unknown",
            image: f.following?.image ?? "/default-avatar.png",
            username: f.following?.username ?? "",
          }))
        );

        setFollowers(
          datafollower.map((f) => ({
            id: f.follower?.id ?? "", // The user who follows the current user
            name: f.follower?.name ?? "Unknown",
            image: f.follower?.image ?? "/default-avatar.png",
            username: f.follower?.username ?? "",
          }))
        );
      } catch (error) {
        console.error("Error fetching following/followers:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user.id) {
      fetchFollowing();
    }
  }, [user.id]);

  return (
    <div>
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center text-center">
            <Link href={`/profile/${user.username}`} className="flex flex-col items-center justify-center">
              <Avatar className="w-20 h-20 border-2">
                <AvatarImage src={user.image || "/avatar.png"} />
              </Avatar>

              <div className="mt-4 space-y-1">
                <h3 className="font-semibold">{user.name}</h3>
                <p className="text-sm text-muted-foreground">@{user.username}</p>
              </div>
            </Link>

            {user.bio && <p className="mt-3 text-sm text-muted-foreground">{user.bio}</p>}

            <div className="w-full">
              <Separator className="my-4" />
              <div className="flex justify-between">
                <div>
                  <button
                    onClick={() => {
                      setIsModalOpen(true);
                      setShowFollowers(false);
                    }}
                  >
                    <p className="font-medium">{user._count.following}</p>
                    <p className="text-xs text-muted-foreground">Following</p>
                  </button>
                </div>
                <Separator orientation="vertical" />
                <div>
                  <button
                    onClick={() => {
                      setIsModalOpen(true);
                      setShowFollowers(true);
                    }}
                  >
                    <p className="font-medium">{user._count.followers}</p>
                    <p className="text-xs text-muted-foreground">Followers</p>
                  </button>
                </div>
              </div>
              <Separator className="my-4" />
            </div>

            <div className="w-full space-y-2 text-sm">
              <div className="flex items-center text-muted-foreground">
                <MapPinIcon className="w-4 h-4 mr-2" />
                {user.location || "No location"}
              </div>
              <div className="flex items-center text-muted-foreground">
                <LinkIcon className="w-4 h-4 mr-2 shrink-0" />
                {user.website ? (
                  <a href={user.website} className="hover:underline truncate" target="_blank" rel="noopener noreferrer">
                    {user.website}
                  </a>
                ) : (
                  "No website"
                )}
              </div>
            </div>
          </div>
        </CardContent>
        {isModalOpen && (
          <Modal
            onClose={() => setIsModalOpen(false)}
            followers={showFollowers ? followers : following}
            isLoading={isLoading}
            title={showFollowers ? "Followers" : "Following"}
          />
        )}
      </Card>
    </div>
  );
};

export default SideBarClient;

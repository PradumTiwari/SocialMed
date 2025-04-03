"use client";
import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "./ui/card";
import Link from "next/link";
import { LinkIcon, MapPinIcon } from "lucide-react";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Separator } from "./ui/separator";
import { getFollowing } from "@/actions/user.action";
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
  const [followers, setFollowers] = useState<{ id: string; name: string; image: string ,username:string}[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch followers when the page loads
  useEffect(() => {
    const fetchFollowing = async () => {
      console.log("Fetching followers...");
      setIsLoading(true);
      
      try {
        const data = await getFollowing();
          // Fetch data from API
        
          
        const followingTable = data?.following || [];

        console.log("Fetched Data:", followingTable);

        setFollowers(
          followingTable.map((f) => ({
            id: f.following?.id ?? "",
            name: f.following?.name ?? "Unknown",
            image: f.following?.image ?? "/default-avatar.png",
            username:f.following?.username??"",
          }))
        );
      } catch (error) {
        console.error("Error fetching followers:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFollowing(); 
  }, []) // Fetch once on mount

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
                <p className="text-sm text-muted-foreground">{user.username}</p>
              </div>
            </Link>

            {user.bio && <p className="mt-3 text-sm text-muted-foreground">{user.bio}</p>}

            <div className="w-full">
              <Separator className="my-4" />
              <div className="flex justify-between">
                <div>
                  <button onClick={() => setIsModalOpen(true)}>
                    <p className="font-medium">{user._count.following}</p>
                    <p className="text-xs text-muted-foreground">Following</p>
                  </button>
                </div>
                <Separator orientation="vertical" />
                <div>
                <button onClick={() => setIsModalOpen(true)}>
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
                  <a href={user.website} className="hover:underline truncate" target="_blank">
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
          <Modal onClose={() => setIsModalOpen(false)} followers={followers} isLoading={isLoading} />
        )}
      </Card>
    </div>
  );
};

export default SideBarClient;

"use server";

import prisma from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

//It does nothing just to check if the user is present in database or not
export async function syncUser() {
  try {
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId || !user || !user.emailAddresses.length) return null;

    const existingUser = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (existingUser) return existingUser;

    const dbUser = await prisma.user.create({
      data: {
        clerkId: userId,
        name: `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim(),
        username: user.username ?? user.emailAddresses[0].emailAddress.split("@")[0],
        email: user.emailAddresses[0].emailAddress,
        image: user.imageUrl,
      },
    });

    return dbUser;
  } catch (error) {
    console.error("Error in syncUser:", error);
    return null;
  }
}

export async function getUserByClerkId(clerkId: string) {
  try {
    
    return prisma.user.findUnique({
      where: { clerkId },
      include: {
        _count: {
          select: { followers: true, following: true, posts: true },
        },
      },
    });
  } catch (error) {
    console.error("Error fetching user by Clerk ID:", error);
    return null;
  }
}

export async function getDbUserId() {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) return null;

    const user = await getUserByClerkId(clerkId);
    if (!user) throw new Error("User not found");

    return user.id;
  } catch (error) {
    console.error("Error getting DB user ID:", error);
    return null;
  }
}

export async function getRandomUsers() {
  try {
    const userId = await getDbUserId();
    if (!userId) return [];

    const randomUsers = await prisma.user.findMany({
      where: {
        AND: [
          { NOT: { id: userId } },
          {
            NOT: {
              followers: {
                some: { followerId: userId },
              },
            },
          },
        ],
      },
      select: {
        id: true,
        name: true,
        username: true,
        image: true,
        _count: { select: { followers: true } },
      },
      take: 3,
    });

    return randomUsers;
  } catch (error) {
    console.error("Error fetching random users:", error);
    return [];
  }
}

export async function toggleFollow(targetUserId: string) {
  try {
    const userId = await getDbUserId();
    if (!userId) return { success: false, error: "User not authenticated" };

    if (userId === targetUserId) {
      return { success: false, error: "You cannot follow yourself" };
    }

    try {
      // Try deleting an existing follow first (unfollow case)
      await prisma.follows.delete({
        where: {
          followerId_followingId: { followerId: userId, followingId: targetUserId },
        },
      });
    } catch {
      // If delete fails, assume follow doesn't exist and proceed to follow
      await prisma.$transaction([
        prisma.follows.create({
          data: { followerId: userId, followingId: targetUserId },
        }),
        prisma.notification.create({
          data: {
            type: "FOLLOW",
            userId: targetUserId,
            creatorId: userId,
            read:false,
          },
        }),
      ]);
    }

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error in toggleFollow:", error);
    return { success: false, error: "Error toggling follow" };
  }
}


export async function getFollowing(){
  const userId=await getDbUserId();
  const strings={userId};
const userid=strings.userId;
   
  if(!userId){
    return null;
  }

  const following=await prisma.user.findUnique({
    where:{
      id:userId,
    },
    include:{
      following:{
        select:{
          followerId:true,
          followingId:true,
        }
      }
    }
   })

   console.log("Following",following);

   return following;
}
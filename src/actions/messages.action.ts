import prisma from "@/lib/prisma";
import { getDbUserId, getFollowers, getFollowing } from "./user.action";

export  async function getUsersToMessage() {
  try {
    const userId = await getDbUserId();
    if (!userId) {
      console.log("User ID is null or undefined");
      return;
    }

    // Optionally fetch full user details (if needed)
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        followers: {
          include: {
            follower: {
              select: {
                id: true,
                name: true,
                username: true,
                image: true,
              },
            },
          },
        },
        following: {
          include: {
            following: {
              select: {
                id: true,
                name: true,
                username: true,
                image: true,
              },
            },
          },
        },
      },
    });

    // Get raw followers
    const rawFollowers = await getFollowers();
    const followers = rawFollowers?.map((f) => ({
      followerId: f.followerId,
      follower: f.follower,
    }));

    // console.log("Followers", followers);

    // Get raw following
    const rawFollowing = await getFollowing();
    const following = rawFollowing?.following?.map((ff) => ({
      followingId: ff.followingId,
      following: ff.following,
    }));

    // console.log("Following", following);

    // Find mutuals
    const mutuals: any[] = [];

    followers?.forEach((f) => {
      const match = following?.find((fl) => fl.followingId === f.followerId);
      if (match) {
        mutuals.push({
          userId: f.followerId,
          data: f.follower, // You could use match.following too, they are same
        });
      }
    });

   

    return mutuals; // optionally return mutuals
  } catch (error) {
    console.error("Error in getUsers:", error);
    return error;
  }
}

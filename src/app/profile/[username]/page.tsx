import {
    getProfileByUsername,
    getUserLikedPosts,
    getUserPosts,
    isFollowing,
  } from "@/actions/profile.action";
  import { notFound } from "next/navigation";
  import ProfilePageClient from "./ProfliePageClient";
import { getBookMark, getBookMarkOfUser } from "@/actions/bookMark.action";
  
  export async function generateMetadata({ params }: { params: { username: string } }) {
    const user = await getProfileByUsername(params.username);
    if (!user) return;
  
    return {
      title: `${user.name ?? user.username}`,
      description: user.bio || `Check out ${user.username}'s profile.`,
    };
  }
  
  async function ProfilePageServer({ params }: { params: { username: string } }) {
    const user = await getProfileByUsername(params.username);
  
    if (!user) notFound();
  
    const [posts, likedPosts, isCurrentUserFollowing,bookMarks] = await Promise.all([
      getUserPosts(user.id),
      getUserLikedPosts(user.id),
      isFollowing(user.id),
      getBookMarkOfUser({ userId: user.id }),
    ]);
  
    return (
      <ProfilePageClient
        user={user}
        posts={posts}
        likedPosts={likedPosts}
        isFollowing={isCurrentUserFollowing}
        bookMark={bookMarks}
      />
    );
  }
  export default ProfilePageServer;
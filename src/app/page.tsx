import { currentUser } from "@clerk/nextjs/server";
import CreatePost from "@/components/CreatePost";
import WhoToFollow from "@/components/WhoToFollow";
import PostCard from "@/components/PostCard";
import { getPosts } from "@/actions/post.actions";
import { getDbUserId, getFollowers } from "@/actions/user.action";

export default async function Home() {
  const follower = await getFollowers();
  const user = await currentUser();
  const posts = await getPosts();
  const dbUserId = await getDbUserId();

  return (
    <div className="flex flex-col lg:grid lg:grid-cols-10 gap-6 px-4 sm:px-6 md:px-8">
      <div className="lg:col-span-6">
        {user ? <CreatePost /> : null}

        <div className="space-y-6 mt-4">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} dbUserId={dbUserId} />
          ))}
        </div>
      </div>

      {/* Show sidebar only on large screens and up */}
      <div className="hidden lg:block lg:col-span-4 sticky top-20 h-fit">
        <WhoToFollow />
      </div>
    </div>
  );
}
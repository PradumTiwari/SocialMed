
import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import CreatePost from "@/components/CreatePost";
import WhoToFollow from "@/components/WhoToFollow";
import PostCard from "@/components/PostCard";
import { getPosts } from "@/actions/post.actions";
import { getDbUserId, getFollowers, getFollowing } from "@/actions/user.action";


export default async function Home() {
  const follower=await getFollowers();
  // console.log("Follower of this",follower);
  
  const user=await currentUser();
  const posts=await getPosts();
 
 const dbUserId=await getDbUserId();
 
 
 
 
 
  return (
    <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
      <div className="lg:col-span-6">
       {user?<CreatePost/>:null}
       
       <div className="space-y-6">
       {posts.map((post)=>(
     <PostCard key={post.id} post={post} dbUserId={dbUserId}/>
       )
    )}
       </div>
      </div>

      <div className="hidden lg:block lg:col-span-4 sticky top-20">
        <WhoToFollow/>
      </div>
    </div>
  );
}


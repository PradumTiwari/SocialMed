"use client";

import { createComment, deletePost, getLikedUsers, getPosts, LikedUser, toggleLike } from "../actions/post.actions";
import { SignInButton, useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Card, CardContent } from "./ui/card";
import Link from "next/link";
import { Avatar, AvatarImage } from "./ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { DeleteAlertDialog } from "./DeleteAlertDialog";
import { Button } from "./ui/button";
import { HeartIcon, LogInIcon, MessageCircleIcon, SendIcon, Trash2Icon } from "lucide-react";
import { Textarea } from "./ui/textarea";
import { CiBookmark } from "react-icons/ci";
import { FaBookmark } from "react-icons/fa";
import { create, getBookMark } from "@/actions/bookMark.action";
import { deleteComment } from "@/actions/comment.action";
import LikedUsersModal from "./LikedUserModal";
import Modal from "./ui/modal";

type Posts = Awaited<ReturnType<typeof getPosts>>;
type Post = Posts[number];

function PostCard({ post, dbUserId, isBookMark }: { post: Post; dbUserId: string | null; isBookMark: string }) {
  const { user } = useUser();
  const [newComment, setNewComment] = useState("");
  const [isCommenting, setIsCommenting] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [hasLiked, setHasLiked] = useState(post.likes.some((like) => like.userId === dbUserId));
  const [optimisticLikes, setOptmisticLikes] = useState(post._count.likes);
  const [showComments, setShowComments] = useState(false);
  const [showBookMark, setShowBookMark] = useState(false);
  const [comments, setComments] = useState(post.comments);
  const [isModal,setIsModal]=useState(false);
  const [users, setUsers] = useState<
  { id: string; image: string; name: string; username: string }[]
>([]);
 const [isLoading, setIsLoading] = useState(true);
  const handleLike = async () => {
    if (isLiking) return;
    try {
      setIsLiking(true);
      setHasLiked((prev) => !prev);
      setOptmisticLikes((prev) => prev + (hasLiked ? -1 : 1));
      await toggleLike(post.id);
    } catch (error) {
      setOptmisticLikes(post._count.likes);
      setHasLiked(post.likes.some((like) => like.userId === dbUserId));
    } finally {
      setIsLiking(false);
    }
  };

  const postId = post.id;

  const handleAddComment = async () => {
    if (!newComment.trim() || isCommenting) return;
  
    try {
      setIsCommenting(true);
      const result = await createComment(post.id, newComment, dbUserId!);
  
      if (result?.success && result.comment) {  
        toast.success("Comment posted successfully");
        setNewComment("");
  
        // Ensure comment includes author details before updating state
        if (result.comment.author) {
          setComments((prevComments) => [...prevComments, result.comment]);
        } else {
          console.error("Missing author data in returned comment:", result.comment);
        }
      } else {
        toast.error("Failed to add comment");
      }
    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error("Failed to add comment");
    } finally {
      setIsCommenting(false);
    }
  };
  

  const handleBookMark = async () => {
    setShowBookMark((prev) => !prev);
    const res = await create({ postId });
    setShowBookMark(res !== false); // If already bookmarked, keep false
  };

  const handleDeletePost = async () => {
    if (isDeleting) return;
    try {
      setIsDeleting(true);
      const result = await deletePost(post.id);
      if (result.success) toast.success("Post deleted successfully");
      else throw new Error(result.error);
    } catch (error) {
      toast.error("Failed to delete post");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (isDeleting) return;
    console.log("Deleting comment with ID:", commentId); // Debugging
    try {
      setIsDeleting(true);
      const result = await deleteComment(commentId);
      console.log("Delete result:", result); // Debugging
      if (result.success) {
        toast.success("Comment deleted successfully");
        setComments((prevComments) => prevComments.filter((comment) => comment.id !== commentId));
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
      toast.error("Failed to delete comment");
    } finally {
      setIsDeleting(false);
    }
  };

  const fetchLikedUsers = async () => {
    try {
      setIsModal(true);
      const likedUsers = await getLikedUsers(postId);
      setUsers(likedUsers.map((l)=>(
        {
          id: l.id ?? "", // The user whom the current user follows
          name: l.name ?? "Unknown",
          image: l.image ?? "/default-avatar.png",
          username: l.username ?? "",
        }
      )))
      setIsLoading(false);
      console.log("Liked Users:", likedUsers);
    } catch (error) {
      console.error("Error fetching liked users:", error);
    }
  };
  

  useEffect(() => {

  
    const fetchBookmark = async () => {
      try {
        const marked = await getBookMark({ postId });
        setShowBookMark(marked === true);
      } catch (error) {
        console.error("Error fetching bookmark:", error);
      }
    };

    if (!isBookMark) {
      fetchBookmark();
    } else {
      setShowBookMark(true);
    }
  }, [postId]);

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4 sm:p-6">
        <div className="space-y-4">
          <div className="flex space-x-3 sm:space-x-4">
            <Link href={`/profile/${post.author.username}`}>
              <Avatar className="size-8 sm:w-10 sm:h-10">
                <AvatarImage src={post.author.image ?? "/avatar.png"} />
              </Avatar>
            </Link>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 truncate">
                  <Link href={`/profile/${post.author.username}`} className="font-semibold truncate">
                    {post.author.name}
                  </Link>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Link href={`/profile/${post.author.username}`}>@{post.author.username}</Link>
                    <span>•</span>
                    <span>{formatDistanceToNow(new Date(post.createdAt))} ago</span>
                  </div>
                </div>
                {dbUserId === post.author.id && <DeleteAlertDialog isDeleting={isDeleting} onDelete={handleDeletePost} />}
              </div>
              <p className="mt-2 text-sm text-foreground break-words">{post.content}</p>
            </div>
          </div>

          {post.image && (
            <div className="rounded-lg overflow-hidden">
              <img src={post.image} alt="Post content" className="w-full h-auto object-cover" />
            </div>
          )}

          <div className="flex justify-between">
            <div className="flex items-center pt-2 space-x-4">
              {user ? (
                <div>
                <Button variant="ghost" size="sm" onClick={handleLike} className={`gap-2 ${hasLiked ? "text-red-500" : "hover:text-red-500"}`}>
                  <HeartIcon className="size-5" />
                  <span>{optimisticLikes}</span>
                </Button>
                <Button onClick={fetchLikedUsers}>View Likes</Button>
                {isModal&&<Modal onClose={() => setIsModal(false)} followers={users}  isLoading={isLoading}  title={"Liked By"}/>}
                </div>

              ) : (
                <SignInButton mode="modal">
                  <Button variant="ghost" size="sm" className="gap-2">
                    <HeartIcon className="size-5" />
                    <span>{optimisticLikes}</span>
                  </Button>
                </SignInButton>
              )}

              <Button variant="ghost" size="sm" className="gap-2 hover:text-blue-500" onClick={() => setShowComments(!showComments)}>
                <MessageCircleIcon className="size-5" />
                <span>{comments.length}</span>
              </Button>
            </div>

            <button className="text-xl" onClick={handleBookMark}>
              {showBookMark ? <FaBookmark /> : <CiBookmark />}
            </button>
          </div>

          {showComments && (
            <div className="pt-4 border-t space-y-4">
              {comments.map((comment) => (
                <div key={comment.id}>
  <div  className="flex space-x-3">
    <Link href={`/profile/${post.author.username}`}>
    <Avatar className="size-8">
      <AvatarImage src={comment.author?.image ?? "/avatar.png"} />
    </Avatar>
    </Link>
    <div className="flex-1">
      <Link href={`/profile/${post.author.username}`}>
    {comment.author ? (
      <div>
        <span>{comment.author.name}</span>
        <span className=" pl-2 text-s text-gray-500">@{comment.author.username}</span>
        </div>
      ) : (
        <span className="text-xs text-red-500">Unknown user</span>
      )}
      </Link>
      <p className="text-sm">{comment.content}</p>
      
    </div>
    {dbUserId === comment.author?.id && (
      <Button variant="ghost" size="sm" className="text-red-500" onClick={() => handleDeleteComment(comment.id)}>
        <Trash2Icon className="size-4" />
      </Button>
    )}
  </div>
  </div>
))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default PostCard;

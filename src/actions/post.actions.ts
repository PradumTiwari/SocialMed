"use server"

import prisma from "@/lib/prisma";
import { getDbUserId } from "./user.action"
import { revalidatePath } from "next/cache";

export async function createPost(content:string,image:string){
    try {
        const userId=await getDbUserId();
        const post = await prisma.post.create({
            data: {
              content,
              image,
              authorId: (userId)?userId:"",
            },
          });
        revalidatePath("/");
        return {success:true,post};
    } catch (error) {
        console.log("Failed to create Post:",error);
        return {sucess:false,message:"Failed to create Post"};
        
    }
}



export async function getPosts(){
 try {
    const posts=await prisma.post.findMany({
        orderBy:{
           createdAt:"desc" 
        },
        include:{
            author:{
                select:{
                    id:true,
                    name:true,
                    username:true,
                }
            },
            comments:{
                include:{
                    author:{
                        select:{
                         id:true,
                         username:true,
                         image:true,
                         name:true,   
                        }
                    }
                },
                orderBy:{
                    createdAt:"asc"
                }
            },
            likes:{
                select:{
                    userId:true,
                }
            },
            _count:{
               select:{
                likes:true,
                comments:true,
               } 
            }
        }
    })
    return posts;
 } catch (error) {
    console.log("Error in getPosts",error);
    throw new Error("Failed to fetch post");
    
    
 }
}


export async function toggleLike(postId: string) {
    try {
      const userId = await getDbUserId();
      if (!userId) return;
  
      // check if like exists
      const existingLike = await prisma.like.findUnique({
        where: {
          userId_postId: {
            userId,
            postId,
          },
        },
      });
  
      const post = await prisma.post.findUnique({
        where: { id: postId },
        select: { authorId: true },
      });
  
      if (!post) throw new Error("Post not found");
  
      if (existingLike) {
        // unlike
        await prisma.like.delete({
          where: {
            userId_postId: {
              userId,
              postId,
            },
          },
        });
      } else {
        // like and create notification (only if liking someone else's post)
        await prisma.$transaction([
          prisma.like.create({
            data: {
              userId,
              postId,
            },
          }),
          ...(post.authorId !== userId
            ? [
                prisma.notification.create({
                  data: {
                    type: "LIKE",
                    userId: post.authorId, // recipient (post author)
                    creatorId: userId, // person who liked
                    postId,
                    read:true,
                  },
                }),
              ]
            : []),
        ]);
      }
  
      revalidatePath("/");
      return { success: true };
    } catch (error) {
      console.error("Failed to toggle like:", error);
      return { success: false, error: "Failed to toggle like" };
    }
  }


  export const createComment = async (postId: string, content: string, authorId: string) => {
    try {
      const comment = await prisma.comment.create({
        data: {
          postId,
          content,
          authorId
        },
        include: {
          author: { // Ensure author data is included
            select: {
              id: true,
              username: true,
              image: true,
              name: true
            }
          }
        }
      });
  
      return { success: true, comment };
    } catch (error) {
      console.error("Error creating comment:", error);
      return { success: false, error: "Failed to create comment" };
    }
  };
  
  
  export async function deletePost(postId: string) {
    try {
      const userId = await getDbUserId();
  
      const post = await prisma.post.findUnique({
        where: { id: postId },
        select: { authorId: true },
      });
  
      if (!post) throw new Error("Post not found");
      if (post.authorId !== userId) throw new Error("Unauthorized - no delete permission");
  
      await prisma.post.delete({
        where: { id: postId },
      });
  
      revalidatePath("/"); // purge the cache
      return { success: true };
    } catch (error) {
      console.error("Failed to delete post:", error);
      return { success: false, error: "Failed to delete post" };
    }
  }
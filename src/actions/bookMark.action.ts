"use server";
import prisma from "@/lib/prisma";
import { getDbUserId } from "./user.action";


interface postIdInput{
    postId:string;
}



export async function create({postId}:postIdInput){

    const userId=await getDbUserId();
    //1st check if the postId is already present in BookMark with this user only or not
    const strings={userId};
  const userid=strings.userId;
  if (!userId) return console.log("User ID is null or undefined");
    
   const existingBookmark=await prisma.bookMark.findFirst({
    where:{
        userId:userId,
        postId:postId,
    }
   })
   
    //Check if the bookmark present in the user has any postId===postId given in argument
   
    if(existingBookmark){
        await prisma.bookMark.delete({
            where:{
                id:existingBookmark.id
            }
        })
        console.log("Bookmark deleted Sucessfully");
        return false;
    }
    else{
        //Create a new bookmark
        await prisma.bookMark.create({
            data:{
                userId,
                postId,
            }
        })
        return true;
    }


}

export async function getBookMark({postId}:postIdInput){
    const userId=await getDbUserId();
    //1st check if the postId is already present in BookMark with this user only or not
    const strings={userId};
  const userid=strings.userId;
  if (!userId) return console.log("User ID is null or undefined");
    
   const existingBookmark=await prisma.bookMark.findFirst({
    where:{
        userId:userId,
        postId:postId,
    }
   })

   if(existingBookmark){
    //exist so return false
    return true;
   }
   return false;
}
export async function getBookMarkOfUser({ userId }: { userId: string }) {
    if (!userId) return [];
  
    const bookmarks = await prisma.bookMark.findMany({
      where: {
        userId: userId,
      },
      include: {
        Post: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
                username: true, // Ensure username is included
                image: true,
              },
            },
            comments: {
              include: {
                author: {
                  select: {
                    id: true,
                    name: true,
                    username: true,
                    image: true,
                  },
                },
              },
              orderBy: {
                createdAt: "asc",
              },
            },
            likes: {
              select: {
                userId: true,
              },
            },
            _count: {
              select: {
                likes: true,
                comments: true,
              },
            },
          },
        },
      },
    });
  
    // Extract and return only the Post objects that are not null
    return bookmarks.map((bookmark) => bookmark.Post).filter((post) => post !== null);
  }
  
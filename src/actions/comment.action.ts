import prisma from "@/lib/prisma"
import { getDbUserId } from "./user.action";

export async function handleDeleteComment(commentId:string){
    const userId=await getDbUserId();
     const strings={userId};
   const userid=strings.userId;
      
     if(!userId){
       return null;
     }
     const comment=await prisma.comment.delete({
        where:{
            authorId:userId,
            id:commentId,
        }
     })
     return {success:true};
}
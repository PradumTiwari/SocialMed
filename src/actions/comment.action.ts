"use server";
import prisma from "@/lib/prisma";
import { getDbUserId } from "./user.action";



export async function deleteComment(commentId: string) {
    try {
        const userId = await getDbUserId();
        if (!userId) {
            return { success: false, error: "User not authenticated" };
        }

        console.log("Inside delete comment");

        const comment = await prisma.comment.findFirst({
            where: { id: commentId, authorId: userId }
        });

        console.log("Is this the comment:", comment);

        if (!comment) {
            return { success: false, error: "Comment not found or not authorized" };
        }

        await prisma.comment.delete({
            where: { id: commentId }
        });

        return { success: true };
    } catch (error) {
        console.error("Error deleting comment:", error);
        return { success: false, error: "Internal server error" };
    }
}



  
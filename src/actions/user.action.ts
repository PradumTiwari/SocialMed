"use server";

import prisma from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";

export async function syncUser() {
    try {
        const { userId } = await auth();
        const user = await currentUser();

        if (!userId || !user) {
            return null;
        }

        let existingUser = await prisma.user.findUnique({
            where: { clerkId: userId }
        });

        if (!existingUser) {
            existingUser = await prisma.user.create({
                data: {
                    clerkId: userId,
                    name: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
                    username: user.username ?? user.emailAddresses[0].emailAddress.split("@")[0],
                    email: user.emailAddresses[0].emailAddress,
                    image: user.imageUrl,
                }
            });
        }

        return existingUser;
    } catch (error) {
        console.error("Error in syncUser:", error);
        return null;
    }
}

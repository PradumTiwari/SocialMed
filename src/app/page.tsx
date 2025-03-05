
import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";



export   default async function Home() {
 
   const user=await currentUser();
   console.log(user);
   
  
  return (
   
    <div className="mt-4">
              
    </div>
  );
}

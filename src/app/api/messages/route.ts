import { getUsersToMessage } from "@/actions/messages.action";
import { NextResponse } from "next/server";
// At the top of your page or route file:
export const dynamic = 'force-dynamic';


export async function GET(){
 const users=await getUsersToMessage();
 console.log("Users Real",users);
  const safeUsers = JSON.parse(JSON.stringify(users));

 
 return NextResponse.json(safeUsers);
}
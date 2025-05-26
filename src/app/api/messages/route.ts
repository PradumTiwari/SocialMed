import { getUsersToMessage } from "@/actions/messages.action";
import { NextResponse } from "next/server";


export async function GET(){
 const users=await getUsersToMessage();
 console.log("Users Real",users);
 
 return NextResponse.json(users);
}
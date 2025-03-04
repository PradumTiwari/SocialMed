import Image from "next/image";
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/ModeToggle";
import { FloatingDock } from "@/components/ui/FloatingDock";
import { currentUser } from "@clerk/nextjs/server";



export   default async function Home() {
 
   const user=await currentUser();
   console.log(user);
   
  
  return (
   
    <div className="mt-4">
            
          
           <div>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Iste libero ut doloribus sit? Facere similique necessitatibus repudiandae eaque autem iste consectetur vero molestiae, numquam quia quae ducimus fugiat odio enim ipsam dolorem sed laborum illum praesentium, porro deserunt veniam? Obcaecati, qui magnam nesciunt nemo odio quae dolorum consequatur animi enim dolor iure in! Doloremque, veniam rerum, exercitationem nihil recusandae nostrum ullam nulla repellat itaque distinctio delectus magni accusamus porro. Illo dolor accusantium ipsam sapiente mollitia assumenda modi dolore beatae atque inventore id nisi placeat neque ab, aut quibusdam quia facere, minima blanditiis voluptatem perferendis labore. Accusamus ex earum tempore illum voluptatibus fugit nihil, illo velit commodi error dignissimos, aliquid delectus cum odit possimus deleniti labore non ad unde repellat quibusdam. Rem dolor magnam ad recusandae sit. Suscipit fugiat nisi assumenda, doloribus tempore perferendis? Pariatur aliquam molestias non commodi et aperiam distinctio eius excepturi eaque, vero natus mollitia totam modi dolores. Beatae veritatis ipsa sed quaerat ratione esse, vel sapiente quae veniam animi error architecto quas, dolore, atque nihil consequuntur? Nulla harum eum neque error deserunt eaque, ipsam minus eveniet quis, beatae libero, aspernatur molestias natus laborum deleniti! Perspiciatis, incidunt numquam dolorum dolore qui in commodi rem, earum sapiente iusto ea!</div>
          
    </div>
  );
}

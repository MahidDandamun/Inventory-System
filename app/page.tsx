import { LoginButton } from "../components/auth/login-button";
 
import { Button } from "../components/ui/button";
import { cn } from "../lib/utils";
import {Poppins} from "next/font/google"

const font = Poppins({
   subsets: ["latin-ext"],
   weight: ["600"]
})


function Home() {
 
   return (
      <>
         <main className="flex h-full flex-col items-center justify-center bg-violet-500">
            <div className="space-y-6 text-center ">
                <h1 className={cn("text-6xl font-semibold  text-white drop-shadow-md",
               font.className,
               )}>
                  Welcome to Theiapollo
               </h1> 
               <div>
                   <LoginButton>
                     <Button  className="bg-gray-200 px-5 py-2 text-black hover:bg-gray-300" variant="secondary" size="lg">
                        Get started
                     </Button>
                  </LoginButton> 
               </div>
            </div>
         </main>  


    </>

  )
}

export default Home;
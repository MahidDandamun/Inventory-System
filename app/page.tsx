import Link from "next/link";

 
function Home() {
   return (
    <>
      <div className='flex items-center justify-center min-h-screen flex-col'>
         <h2 className="text-3xl text-orange-500 mb-5">
            Welcome to Theiapollo
         </h2>
         <Link href={"/dashboard"}><button className="w-22 h-14 bg-orange-500 text-white rounded-lg">Click me to enter dashboard</button></Link>  
      </div>
    </>

  )
}

export default Home;
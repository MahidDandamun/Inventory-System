import bgImage from "../../images/bg/bg.jpg";
import Image from "next/image";
function LoginPage() {
  return (
    <>
      <div className="flex w-screen h-screen   
        border  
        dark:bg-gray-800 dark:border-gray-700">
        <div className="hidden sm:block flex-1  bg-gradient-to-r from-violet-900 to-violet-600 ">
          
        </div>
        <div className="flex h-full flex-1 justify-center sm:items-center  ">
            <form className="flex flex-col p-4 mt-16 sm:mt-0 sm:rounded-lg bg-white w-full sm:w-7/12 h-4/6"  action="#">
                <h5 className="text-4xl text-violet-600 font-semibold mb-4 text-center">Theiapollo</h5>
                <h6 className="text-xs text-violet-800 font-thin mb-28 sm:mb-48 mt-0 text-center">Inventory System</h6>
                <div className="mb-8">
                    <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-500 dark:text-white">Username</label>
                    <input type="email" name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-violet-400 focus:border-violet-400 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="name@company.com" required/>
                </div>
                <div className="mb-12">
                    <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-500 dark:text-white">Password</label>
                    <input type="password" name="password" id="password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-violet-400 focus:border-violet-400 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" required/>
                </div>
                <p className="hidden text-sm  ">Wrong password or Email</p>
    
                <button type="submit" className="w-full sm:w-6/12 self-center transition-all ease-in delay-50 text-white bg-violet-500 hover:bg-violet-800 hover: focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-violet-600 dark:hover:bg-violet-700 dark:focus:ring-blue-800 shadow-2xl">Login</button>
            </form>          
        
 
        </div>
      </div>
    </>
  )
}


export default LoginPage;
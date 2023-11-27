import Navbar from "../ui/dashboard/navbar/navbar";
import Sidebar from "../ui/dashboard/sidebar/sidebar";
 
 
function Layout({children}) {
  return (
    <div>
      <div>
        <Sidebar />
      </div>
      <div>
        <Navbar />
        <div className="h-screen bg-white-400 dark:bg-gray-900">
        {children}                 
        </div>
      </div>
    </div>
  )
}
export default Layout;
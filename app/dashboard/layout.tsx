 
import Navbar from "../../components/ui/dashboard/navbar/navbar";
import Sidebar from "../../components/ui/dashboard/sidebar/sidebar";
import  PageWrapper  from "../../components/ui/dashboard/page-wrapper";
 
interface Props { 
  children: React.ReactNode;

}

function Layout({ children }: Props) {
  
 
  return (
    <div>   
        <Sidebar/>
        <Navbar/>
        <PageWrapper>
          {children}                  
        </PageWrapper>
      
    </div>
  )
}
export default Layout;
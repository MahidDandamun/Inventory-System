import Navbar from '../../components/ui/dashboard/navbar/navbar';
import Sidebar from '../../components/ui/dashboard/sidebar/sidebar';
import PageWrapper from '../../components/ui/dashboard/page-wrapper';
import { ThemeProvider } from '../../components/ui/theme-provider';

interface Props {
  children: React.ReactNode;
}

function Layout({ children }: Props) {
  return (
    <div className=" ">
      <ThemeProvider>
        <Sidebar />
        <Navbar />
        <PageWrapper>{children}</PageWrapper>
      </ThemeProvider>
    </div>
  );
}
export default Layout;

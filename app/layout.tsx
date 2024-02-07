import { Inter } from 'next/font/google';
import { SessionProvider } from 'next-auth/react';
import { auth } from '../auth';
import './globals.css';
import Navbar from "../components/ui/dashboard/navbar/navbar";
import Sidebar from "../components/ui/dashboard/sidebar/sidebar";
import PageWrapper from '../components/ui/dashboard/page-wrapper';
const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Theiapollo',
  description: 'Created by Black Python Group',
}

interface Props{
  children?: React.ReactNode
}

export default async function RootLayout({ children }:Props) {
  const session = await auth();
  return (
    <SessionProvider session={session}> 
      <html lang="">
        <body className="h-12/12">
          {children}        
        </body>
      </html>
    </SessionProvider>
  )
}

import { LoginButton } from '../components/auth/login-button';

import { Button } from '../components/ui/button';
import { cn } from '../lib/utils';
import { Poppins } from 'next/font/google';
import HomeBg from '../images/HomeBg.jpg';
import Image from 'next/image';
const font = Poppins({
  subsets: ['latin-ext'],
  weight: ['600'],
});

function Home() {
  return (
    <>
      <main className="flex h-full flex-col items-center justify-center bg-white dark:bg-[#070D1C]">
        <div className="w-100 mx-auto sm:max-w-2xl md:max-w-3xl lg:max-w-5xl xl:max-w-7xl">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="mt-12 lg:mt-0">
              <h1 className="mt-2 mb-16 text-5xl font-semibold tracking-tight md:text-6xl xl:text-7xl">
                <span className="dark:text-violet-500 text-violet-600 font-bold ">
                  Theiapollo
                </span>
                <br />
                Inventory System
                <br />
                <span className="text-primary">for your business</span>
              </h1>
              <LoginButton>
                <Button
                  className="bg-gray-200 px-5 py-2 text-violet-500 dark:text-white dark:bg-violet-600 hover:bg-gray-300"
                  variant="secondary"
                  size="lg"
                >
                  Get started
                </Button>
              </LoginButton>
            </div>
            <div className="mb-12 lg:mb-0">
              <Image src={HomeBg} className="rounded-md" alt="Homebg" />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default Home;

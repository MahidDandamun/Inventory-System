import React from 'react';

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full flex items-center justify-center bg-white dark:bg-[#070D1C]">
      {children}
    </div>
  );
};

export default AuthLayout;

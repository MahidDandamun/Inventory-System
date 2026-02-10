import { SessionProvider } from 'next-auth/react';
import { auth } from '../auth';
import './globals.css';
import { ThemeProvider } from '../components/ui/theme-provider';

export const metadata = {
  title: 'Theiapollo',
  description: 'Created by Black Python Group',
  icons: {
    icon: ['../images/theiapollo-logo.jpg'],
    apple: ['../images/theiapollo-logo.jpg'],
  },
};

interface Props {
  children?: React.ReactNode;
}

export default async function RootLayout({ children }: Props) {
  const session = await auth();
  return (
    <SessionProvider session={session}>
      <html lang="en" suppressHydrationWarning>
        <body>
          <ThemeProvider
            themes={['dark', 'light']}
            attribute="class"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </body>
      </html>
    </SessionProvider>
  );
}

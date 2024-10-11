import { Recursive } from 'next/font/google';
import './globals.css';
import { NavBar } from './ui/NavBar';

const recursive = Recursive({ subsets: ['latin'] });

export default function RootLayout({ children }) {
  return (
    <html lang='pt-br'>
      <body className={recursive.className}>
        <NavBar />

        <main className='flex grainy-light flex-col min-h-[calc(100vh-3.5rem-1px)]'>
          <div className='flex-1 flex flex-col h-full'>{children}</div>
        </main>
      </body>
    </html>
  );
}

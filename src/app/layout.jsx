import { Recursive } from 'next/font/google';
import './globals.css';
import { NavBar } from './ui/NavBar';
import { Bounce, ToastContainer } from 'react-toastify';

const recursive = Recursive({ subsets: ['latin'] });

export default function RootLayout({ children }) {
  return (
    <html lang='pt-br'>
      <body className={recursive.className}>
        <main className='flex grainy-light flex-col min-h-[calc(100vh-3.5rem-1px)]'>
          <div className='flex-1 flex flex-col h-full'>{children}</div>
        </main>
        <ToastContainer
          position='bottom-right'
          autoClose={2000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          limit={1}
          pauseOnHover
          theme='colored'
        />
      </body>
    </html>
  );
}

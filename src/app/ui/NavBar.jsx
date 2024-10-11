import Link from 'next/link';

export const NavBar = () => {
  return (
    <nav className='w-full flex justify-between items-center p-4 bg-blue-600 text-white'>
      <div className='flex items-center'>
        <Link href='/' className='text-lg font-semibold hover:underline'>
          Scanner
        </Link>
      </div>
      <div className='flex gap-5'>
        <Link href='/orders' className='text-lg font-medium hover:underline'>
          Meus pedidos
        </Link>
      </div>
    </nav>
  );
};

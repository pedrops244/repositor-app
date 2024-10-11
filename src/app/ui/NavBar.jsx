import Link from 'next/link';

export const NavBar = () => {
  return (
    <nav className='w-full flex justify-center items-center p-4 bg-blue-600 text-white'>
      <div className='flex items-center gap-7'>
        <Link href='/scanner' className='text-lg font-semibold hover:underline'>
          Scanner
        </Link>

        <Link href='/orders' className='text-lg font-medium hover:underline'>
          Meus pedidos
        </Link>

        <Link href='/' className='text-lg font-medium hover:underline'>
          Sair
        </Link>
      </div>
    </nav>
  );
};

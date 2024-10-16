import Link from 'next/link';

export const NavBar = () => {
  return (
    <nav className='w-full flex justify-center items-center p-3 bg-blue-600 text-white'>
      <div>
        <div className='flex space-x-4'>
          <Link
            href='/scanner'
            className='block rounded-md px-3 py-2 text-base font-medium text-white hover:bg-blue-500 hover:text-white'
          >
            Scanner
          </Link>

          <Link
            href='/orders'
            className='block rounded-md px-3 py-2 text-base font-medium text-white hover:bg-blue-500 hover:text-white'
          >
            Meus Pedidos
          </Link>

          <Link
            href='/submenu'
            className='block rounded-md px-3 py-2 text-base font-medium text-white hover:bg-blue-500 hover:text-white'
          >
            Voltar
          </Link>
        </div>
      </div>
    </nav>
  );
};

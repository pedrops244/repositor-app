import Link from 'next/link';
import Container from '../ui/Container';
import { NavBar } from '../ui/NavBar';
import Image from 'next/image';

const SubMenu = () => {
  return (
    <>
      {/* <NavBar /> */}
      <Container>
        <div className='flex justify-center mt-14'>
          <Image
            src='/images/lojas_o_amigo_logo.jpg'
            alt='Logo da Empresa'
            width={180}
            height={50}
            className='object-contain rounded-xl'
          />
        </div>
        <div className='flex flex-col w-auto justify-center gap-4 mt-8'>
          <Link
            className='flex justify-center rounded-md px-3 py-2 text-base font-medium text-black bg-yellow-400 hover:bg-yellow-300'
            href='/scanner'
          >
            Criar nova remessa
          </Link>
          <Link
            className='flex justify-center rounded-md px-3 py-2 text-base font-medium text-black bg-yellow-400 hover:bg-yellow-300'
            href='/orders'
          >
            Ver minhas remessas
          </Link>
          <Link
            className='flex justify-center rounded-md px-3 py-2 text-base font-medium text-white bg-blue-600 hover:bg-blue-400'
            href='/'
          >
            Sair
          </Link>
        </div>
      </Container>
    </>
  );
};

export default SubMenu;

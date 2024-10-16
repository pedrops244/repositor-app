'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Container from './ui/Container';
import Input from './ui/Input';
import Button from './ui/Button';
import Image from 'next/image';
import { toast } from 'react-toastify';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  const handleLogin = () => {
    if (username === '' || password === '') {
      toast.error('Por favor, preencha todos os campos.');
      return;
    }

    if (username !== 'admin' || password !== '123') {
      toast.error('Usuário ou senha incorretos.');
      return;
    }

    router.push('/submenu');
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <Container>
      <div className='flex justify-center mt-20'>
        <Image
          src='/images/lojas_o_amigo_logo.jpg'
          alt='Logo da Empresa'
          width={180}
          height={50}
          className='object-contain rounded-full'
        />
      </div>
      <h1 className='text-4xl font-bold mb-4 mt-3 flex justify-center'>
        Login
      </h1>

      <div className='flex flex-col sm:flex-col justify-center gap-3 mt-8'>
        <span className='sm:mt-2 text-sm font-bold text-slate-700'>
          Usuário
        </span>
        <Input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder='Usuário'
          className='mb-4'
        />

        <span className='sm:mt-2 text-sm font-bold text-slate-700'>Senha</span>
        <Input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type='password'
          placeholder='Senha'
          className='mb-4'
        />

        <Button text='Entrar' color='bg-blue-600' onClick={handleLogin} />
      </div>
      <div className='flex justify-center mt-6'>
        <Button
          text='Configurações'
          color='bg-yellow-400'
          onClick={toggleModal}
        />
      </div>
      {isModalOpen && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center'>
          <div className='bg-white p-6 rounded-lg shadow-lg w-full max-w-md'>
            <h2 className='text-lg font-semibold mb-4'>Configurações</h2>
            <div className='flex flex-col space-y-4'>
              <span>Entre com o endereço do servidor</span>
              <Input
                placeholder='Endereço do servidor (0.0.0.0:9999)'
                className='flex-1'
              />
              <Button
                text='Conectar'
                color='bg-blue-600'
                onClick={toggleModal}
                className='ml-2'
              />
              <Button
                color='bg-red-500'
                text='Fechar'
                onClick={toggleModal}
                className='mt-2'
              />
            </div>
          </div>
        </div>
      )}
    </Container>
  );
};

export default Login;

'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Container from './ui/Container';
import Input from './ui/Input';
import Button from './ui/Button';
import Image from 'next/image';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  const handleLogin = () => {
    if (username === '' || password === '') {
      setErrorMessage('Por favor, preencha todos os campos.');
      return;
    }

    if (username !== 'admin' || password !== '123') {
      setErrorMessage('Usuário ou senha incorretos.');
      return;
    }

    router.push('/scanner');
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <Container>
      <div className='flex justify-center'>
        <Image
          src='/images/lojas_o_amigo_logo.jpg' // Caminho para sua logo
          alt='Logo da Empresa'
          width={180} // Largura desejada
          height={50} // Altura desejada
          className='object-contain' // Para manter a proporção
        />
      </div>
      <h1 className='text-2xl font-bold mb-4 mt-5 flex justify-center'>
        Login
      </h1>
      <div className='flex flex-col sm:flex-row justify-center gap-4 mt-8'>
        {errorMessage && <p className='text-red-500 mb-4'>{errorMessage}</p>}

        <Input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder='Usuário'
          className='mb-4'
        />

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

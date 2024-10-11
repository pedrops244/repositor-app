'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Container from './ui/Container';
import Input from './ui/Input';
import Button from './ui/Button';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
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

  return (
    <Container>
      <div className='flex flex-col sm:flex-row justify-center gap-4 mt-8'>
        <h2 className='text-2xl font-bold mb-4 flex justify-center'>Login</h2>

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
    </Container>
  );
};

export default Login;

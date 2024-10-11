// src/pages/index.js
import { useState } from 'react';
import { useRouter } from 'next/router';
import Scanner from '../components/Scanner';
import ProductInput from '../components/ProductInput';
import ProductList from '../components/ProductList';

export default function Home() {
  const [produtos, setProdutos] = useState([]);
  const router = useRouter();

  const addProduct = (codigo, quantidade) => {
    setProdutos([...produtos, { codigo, quantidade }]);
  };

  const enviarProdutos = () => {
    if (produtos.length === 0) {
      alert('Nenhum produto para enviar.');
      return;
    }

    const pedidos = JSON.parse(localStorage.getItem('pedidos')) || [];
    pedidos.push(produtos);
    localStorage.setItem('pedidos', JSON.stringify(pedidos));

    alert('Produtos enviados com sucesso!');
    setProdutos([]);
  };

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gray-100'>
      <nav className='mb-4'>
        <button onClick={() => router.push('/orders')} className='btn'>
          Ver Meus Pedidos
        </button>
      </nav>

      <ProductInput addProduct={addProduct} />
      <ProductList produtos={produtos} />
      <button onClick={enviarProdutos} className='btn ml-2'>
        Enviar Produtos
      </button>
      <Scanner />
    </div>
  );
}

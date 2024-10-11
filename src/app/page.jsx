'use client';
import { useEffect, useState } from 'react';
import Container from './ui/Container';
import { NavBar } from './ui/NavBar';
import Button from './ui/Button';
import Input from './ui/Input';

export default function Home() {
  const [code, setCode] = useState('');
  const [quantity, setQuantity] = useState('');
  const [produtos, setProdutos] = useState([]);

  /* Botão que limpar o localStorage(Desenvolvimento) */
  const clearLocalStorage = () => {
    localStorage.removeItem('pedidos');
    alert('Todos os pedidos foram removidos.');
  };

  const addProduct = () => {
    if (!code || !quantity || isNaN(quantity) || quantity <= 0) {
      alert('Preencha o código e uma quantidade válida.');
      return;
    }

    const quantidadeInt = parseInt(quantity, 10);
    const updatedProdutos = [...produtos];

    for (let i = 0; i < quantidadeInt; i++) {
      updatedProdutos.push({ codigo: code, quantidade: 1 });
    }

    setProdutos(updatedProdutos);

    setCode('');
    setQuantity('');
  };

  const removeProduct = (index) => {
    const updatedProdutos = produtos.filter((_, idx) => idx !== index);
    setProdutos(updatedProdutos);
  };

  const enviarPedido = () => {
    if (produtos.length === 0) {
      alert('Nenhum produto no pedido para enviar.');
      return;
    }

    const pedidos = JSON.parse(localStorage.getItem('pedidos')) || [];
    const novoPedido = [...produtos];

    pedidos.push(novoPedido);
    localStorage.setItem('pedidos', JSON.stringify(pedidos));

    alert('Pedido enviado com sucesso!');
    setProdutos([]);
  };

  return (
    <Container>
      <div className='flex flex-col sm:flex-row justify-center gap-4 mt-8'>
        <Input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder='Código lido'
          disabled={false}
        />

        <Input
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          placeholder='Quantidade'
        />

        <Button
          text='Adicionar Produto'
          color='bg-blue-600'
          onClick={addProduct}
        />
      </div>

      <div className='mt-8'>
        <h2 className='text-center text-lg font-semibold'>
          Produtos Adicionados
        </h2>
        {produtos.length === 0 ? (
          <p className='text-center'>Nenhum produto adicionado.</p>
        ) : (
          <ul className='mt-4 space-y-2'>
            {produtos.map((produto, index) => (
              <li
                key={index}
                className='flex justify-between items-center bg-gray-100 p-2 rounded-md'
              >
                <span>
                  <p className='text-sm'>Produto: {produto.codigo}</p>
                  <p className='text-sm'>Quantidade: {produto.quantidade} </p>
                </span>
                <Button
                  text='Remover'
                  color='bg-red-500'
                  onClick={() => removeProduct(index)}
                />
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className='flex justify-center mt-8'>
        <Button
          text='Enviar Pedido'
          color='bg-yellow-400'
          onClick={enviarPedido}
        />
      </div>
      <div className='text-center mt-6'>
        <button
          onClick={clearLocalStorage}
          className='bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600'
        >
          Limpar Pedidos
        </button>
      </div>
    </Container>
  );
}

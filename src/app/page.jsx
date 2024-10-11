'use client';
import { useState, useEffect } from 'react';
import Container from './ui/Container';
import { NavBar } from './ui/NavBar';
import Button from './ui/Button';
import Input from './ui/Input';

export default function Home() {
  const [code, setCode] = useState('');
  const [quantity, setQuantity] = useState('');
  const [produtos, setProdutos] = useState([]);

  useEffect(() => {
    const storedPedidos = JSON.parse(localStorage.getItem('pedidos')) || [];
    setProdutos(storedPedidos);
  }, []);

  const addProduct = () => {
    if (code === '' || quantity === '') {
      alert('Preencha ambos os campos.');
      return;
    }

    const newProduct = { codigo: code, quantidade: quantity };
    const updatedProdutos = [...produtos, newProduct];

    setProdutos(updatedProdutos);
    localStorage.setItem('pedidos', JSON.stringify(updatedProdutos));

    setCode('');
    setQuantity('');
  };

  const removeProduct = (index) => {
    const updatedProdutos = produtos.filter((_, idx) => idx !== index);
    setProdutos(updatedProdutos);
    localStorage.setItem('pedidos', JSON.stringify(updatedProdutos));
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
    localStorage.removeItem('pedidos');
  };

  return (
    <Container>
      <div className='flex justify-center gap-4 mt-8 '>
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
                  <p className='text-sm'>Quantidade:{produto.quantidade}</p>
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
          text='Enviar Produtos'
          color='bg-yellow-400'
          onClick={enviarProdutos}
        />
      </div>
    </Container>
  );
}

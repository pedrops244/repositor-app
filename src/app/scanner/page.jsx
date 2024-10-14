'use client';
import { useEffect, useState } from 'react';
import Container from '../ui/Container';
import { NavBar } from '../ui/NavBar';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { toast } from 'react-toastify';

const Home = () => {
  const [code, setCode] = useState('');
  const [quantity, setQuantity] = useState('');
  const [produtos, setProdutos] = useState([]);
  const [produtoExpandido, setProdutoExpandido] = useState({});

  /* Botão que limpa o localStorage (Desenvolvimento) */
  const clearLocalStorage = () => {
    localStorage.removeItem('pedidos');
    setProdutos([]);
    toast.success('Todos os pedidos foram removidos.');
  };

  const addProduct = () => {
    if (!code || !quantity || isNaN(quantity) || quantity <= 0) {
      toast.warning('Preencha o código e uma quantidade válida.');
      return;
    }

    const quantidadeInt = parseInt(quantity, 10);
    const updatedProdutos = [...produtos];

    const existingProductIndex = updatedProdutos.findIndex(
      (produto) => produto.codigo === code,
    );

    if (existingProductIndex >= 0) {
      updatedProdutos[existingProductIndex].quantidade += quantidadeInt;
    } else {
      updatedProdutos.push({ codigo: code, quantidade: quantidadeInt });
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
      toast.info('Nenhum produto no pedido para enviar.');
      return;
    }

    const pedidos = JSON.parse(localStorage.getItem('pedidos')) || [];
    const novoPedido = [...produtos];

    pedidos.push(novoPedido);
    localStorage.setItem('pedidos', JSON.stringify(pedidos));

    toast.success('Pedido enviado com sucesso!');
    setProdutos([]);
  };

  const toggleExpandProduto = (index) => {
    setProdutoExpandido((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <>
      <NavBar />
      <Container>
        <div className='flex flex-col sm:flex-row justify-center gap-4 mt-8'>
          <Input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder='Código lido'
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
            <div className='mt-4 space-y-2'>
              {produtos.map((produto, index) => (
                <div key={index} className='border p-2 rounded-md'>
                  <div
                    className='flex justify-between items-center cursor-pointer'
                    onClick={() => toggleExpandProduto(index)}
                  >
                    <div className='flex flex-col justify-between w-full'>
                      <span>
                        <strong>Produto:</strong> {produto.codigo}
                      </span>
                      <span className='mr-2'>
                        <strong>Quantidade:</strong> {produto.quantidade}
                      </span>
                    </div>

                    <span className='mr-2'>
                      {produtoExpandido[index] ? (
                        <FaChevronUp className='text-blue-600' />
                      ) : (
                        <FaChevronDown className='text-blue-600' />
                      )}
                    </span>

                    <Button
                      text='Remover'
                      color='bg-red-500'
                      onClick={() => removeProduct(index)}
                    />
                  </div>

                  {produtoExpandido[index] && (
                    <div className='ml-4 space-y-1 mt-2'>
                      {Array.from({ length: produto.quantidade }).map(
                        (_, i) => (
                          <div key={i} className='flex justify-between'>
                            <p key={i}>{`Unidade ${i + 1}: ${
                              produto.codigo
                            }`}</p>
                          </div>
                        ),
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
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
    </>
  );
};

export default Home;

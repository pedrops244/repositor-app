'use client';
import { useEffect, useState } from 'react';
import Container from '../ui/Container';
import { NavBar } from '../ui/NavBar';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { IoIosRemoveCircle } from 'react-icons/io';
import { toast } from 'react-toastify';

const Scanner = () => {
  const [code, setCode] = useState('');
  const [quantity, setQuantity] = useState('');
  const [produtos, setProdutos] = useState([]);
  const [produtoExpandido, setProdutoExpandido] = useState({});
  const MAX_QUANTIDADE = 30;

  const clearLocalStorage = () => {
    if (produtos.length === 0) {
      toast.info('Nenhum produto no pedido para remover.');
      return;
    }
    localStorage.removeItem('pedidos');
    toast.success('Todos os pedidos foram removidos.');
    setProdutos([]);
  };

  const addProduct = () => {
    const quantidadeInt = Math.min(parseInt(quantity, 10), MAX_QUANTIDADE);

    if (!code || isNaN(quantidadeInt) || quantidadeInt <= 0) {
      toast.warning('Preencha o código e uma quantidade válida.');
      return;
    }

    const updatedProdutos = [...produtos];
    const existingProductIndex = updatedProdutos.findIndex(
      (produto) => produto.codigo === code,
    );

    if (existingProductIndex >= 0) {
      updatedProdutos[existingProductIndex].quantidade = Math.min(
        updatedProdutos[existingProductIndex].quantidade + quantidadeInt,
        MAX_QUANTIDADE,
      );
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

  const sendPedido = () => {
    if (produtos.length === 0) {
      toast.info('Nenhum produto no pedido para enviar.');
      return;
    }

    const pedidos = JSON.parse(localStorage.getItem('pedidos')) || [];
    const novoPedido = {
      produtos,
      enviadoEm: new Date().toISOString(),
    };

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
            type='number'
            min='1'
            max={MAX_QUANTIDADE}
            value={quantity}
            onChange={(e) =>
              setQuantity(Math.min(e.target.value, MAX_QUANTIDADE))
            }
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
                    <div className='flex sm:flex-row flex-col justify-between w-full'>
                      <span>
                        <strong>Produto:</strong> {produto.codigo}
                      </span>
                      <span className='mr-2'>
                        <strong>Quantidade:</strong> {produto.quantidade}
                      </span>
                    </div>

                    <span className='mr-2 hidden sm:flex'>
                      {produtoExpandido[index] ? (
                        <FaChevronUp className='text-blue-600' />
                      ) : (
                        <FaChevronDown className='text-blue-600' />
                      )}
                    </span>
                    <Button
                      text={<IoIosRemoveCircle />}
                      color='bg-red-500'
                      onClick={() => removeProduct(index)}
                    />
                  </div>

                  {produtoExpandido[index] && (
                    <div className='border p-2 rounded-md mt-2 border-yellow-500'>
                      <ul className='ml-4 space-y-1 list-decimal'>
                        {Array.from({
                          length: Math.min(produto.quantidade, MAX_QUANTIDADE),
                        }).map((_, i) => (
                          <li className='ml-3' key={i}>
                            {`Unidade | ${produto.codigo}`}
                          </li>
                        ))}
                      </ul>
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
            onClick={sendPedido}
          />
        </div>
        <div className='text-center mt-6'>
          <Button
            text='Limpar pedidos'
            color='bg-red-500'
            onClick={clearLocalStorage}
          />
        </div>
      </Container>
    </>
  );
};

export default Scanner;

'use client';
import { useEffect, useState } from 'react';
import Quagga from '@ericblade/quagga2';
import Container from '../ui/Container';
import { NavBar } from '../ui/NavBar';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { IoIosRemoveCircle } from 'react-icons/io';
import { toast } from 'react-toastify';
import BarcodeScanner from '../lib/BarcodeScanner';

const Scanner = () => {
  const [code, setCode] = useState('');
  const [quantity, setQuantity] = useState('');
  const [produtos, setProdutos] = useState([]);
  const [produtoExpandido, setProdutoExpandido] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const MAX_QUANTIDADE = 30;

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleDetected = (scannedCode) => {
    setCode(scannedCode);
    closeModal();
  };

  const clearLocalStorage = () => {
    if (produtos.length === 0) {
      toast.info('Nenhum produto no pedido para remover.');
      return;
    }
    localStorage.removeItem('createOrders');
    localStorage.removeItem('receivedOrders');
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
      updatedProdutos.push({
        id: crypto.randomUUID(),
        codigo: code,
        quantidade: quantidadeInt,
      });
    }

    setProdutos(updatedProdutos);
    setCode('');
    setQuantity('');
  };
  const sendPedido = () => {
    if (produtos.length === 0) {
      toast.info('Nenhum produto no pedido para enviar.');
      return;
    }

    const pedidos = JSON.parse(localStorage.getItem('createOrders')) || [];
    const novoPedido = {
      id: crypto.randomUUID(),
      produtos,
      enviadoEm: new Date().toISOString(),
    };

    pedidos.push(novoPedido);
    localStorage.setItem('createOrders', JSON.stringify(pedidos));

    toast.success('Pedido enviado com sucesso!');
    setProdutos([]);
  };

  return (
    <>
      <NavBar />
      <Container>
        <div className='flex flex-col justify-center gap-4 mt-8'>
          <Button
            text='Escanear'
            color='bg-yellow-400'
            textColor='text-black'
            hover='hover:bg-yellow-300'
            onClick={openModal}
          />
          <Input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder='Código do produto'
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
                    onClick={() =>
                      setProdutoExpandido((prev) => ({
                        ...prev,
                        [index]: !prev[index],
                      }))
                    }
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
                      onClick={() =>
                        setProdutos(produtos.filter((_, i) => i !== index))
                      }
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

        {isModalOpen && (
          <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center'>
            <div className='bg-white p-6 rounded-lg shadow-lg w-full max-w-md'>
              <h2 className='text-lg font-semibold mb-4'>Escaneando...</h2>
              <div className='flex flex-col'>
                <BarcodeScanner onDetected={handleDetected} />
                <Button text='Fechar' color='bg-red-500' onClick={closeModal} />
              </div>
            </div>
          </div>
        )}
        <div className='flex justify-center mt-8'>
          <Button
            text='Enviar Pedido'
            color='bg-yellow-400'
            hover='hover:bg-yellow-300'
            textColor='text-black'
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

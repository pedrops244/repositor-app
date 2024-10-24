'use client';
import { useEffect, useState } from 'react';
import Container from '../ui/Container';
import { NavBar } from '../ui/NavBar';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { formatarData } from '../lib/formatarData';
import { saveToLocalStorage } from '../lib/saveToLocalStorage';
import Button from '../ui/Button';
import BarcodeScanner from '../lib/BarcodeScanner';
import { toast } from 'react-toastify';

const OrdersPage = () => {
  const [receivedOrders, setReceivedOrders] = useState([]);
  const [checkedOrders, setCheckedOrders] = useState([]);
  const [pedidoExpandido, setPedidoExpandido] = useState({});
  const [produtoExpandido, setProdutoExpandido] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedReceivedOrders =
        JSON.parse(localStorage.getItem('receivedOrders')) || [];
      const storedCheckedOrders =
        JSON.parse(localStorage.getItem('checkedOrders')) || [];
      setReceivedOrders(storedReceivedOrders);
      setCheckedOrders(storedCheckedOrders);
    }
  }, []);

  const handleSelectOrder = (event) => {
    setSelectedOrderId(event.target.value);
  };

  const toggleExpandPedido = (pedidoIndex) => {
    setPedidoExpandido((prev) => ({
      ...prev,
      [pedidoIndex]: !prev[pedidoIndex],
    }));
  };

  const toggleExpandProduto = (pedidoIndex, produtoIndex) => {
    const key = `${pedidoIndex}-${produtoIndex}`;
    setProdutoExpandido((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleDetected = (scannedCode) => {
    if (!selectedOrderId) {
      closeModal();
      return toast.error('Por favor, selecione um pedido.');
    }

    const updatedReceivedOrders = updateReceivedOrders(scannedCode);
    if (!updatedReceivedOrders) {
      toast.error('Produto não encontrado no pedido.');
      closeModal();
      return setTimeout(() => window.location.reload(), 2000);
    }

    const newCheckedOrders = updateCheckedOrders(scannedCode);

    saveOrdersToLocalStorage(updatedReceivedOrders, newCheckedOrders);
    setReceivedOrders(updatedReceivedOrders);
    setCheckedOrders(newCheckedOrders);

    toast.success('Produto atualizado com sucesso.');
    closeModal();
    return setTimeout(() => window.location.reload(), 2000);
  };

  const updateReceivedOrders = (scannedCode) => {
    let foundProduct = false;

    const updatedOrders = receivedOrders
      .map((pedido) => {
        if (pedido.id !== selectedOrderId) return pedido;

        const updatedProdutos = pedido.produtos.filter((produto) => {
          if (produto.codigo === scannedCode && !foundProduct) {
            foundProduct = true;
            return produto.quantidade > 1 ? --produto.quantidade : false;
          }
          return true;
        });

        return { ...pedido, produtos: updatedProdutos };
      })
      .filter((pedido) => pedido.produtos.length > 0);

    return foundProduct ? updatedOrders : null;
  };

  const updateCheckedOrders = (scannedCode) => {
    const pedidoExistente = checkedOrders.find(
      (pedido) => pedido.id === selectedOrderId,
    );

    if (pedidoExistente) {
      const produtoExistente = pedidoExistente.produtos.find(
        (produto) => produto.codigo === scannedCode,
      );

      if (produtoExistente) {
        produtoExistente.quantidade += 1;
      } else {
        const produtoAdicionado = receivedOrders
          .flatMap((pedido) => pedido.produtos)
          .find((produto) => produto.codigo === scannedCode);

        if (produtoAdicionado) {
          pedidoExistente.produtos.push({
            ...produtoAdicionado,
            quantidade: 1,
          });
        }
      }
    } else {
      const novoPedido = {
        id: selectedOrderId,
        produtos: [
          {
            ...receivedOrders
              .flatMap((pedido) => pedido.produtos)
              .find((produto) => produto.codigo === scannedCode),
            quantidade: 1,
          },
        ],
        conferidoEm: new Date().toISOString(),
      };
      checkedOrders.push(novoPedido);
    }

    return checkedOrders;
  };

  const saveOrdersToLocalStorage = (receivedOrders, checkedOrders) => {
    saveToLocalStorage('receivedOrders', receivedOrders);
    saveToLocalStorage('checkedOrders', checkedOrders);
  };

  const testingHandleFunc = () => {
    handleDetected('2121');
  };

  return (
    <>
      <NavBar />
      <Container>
        <h2 className='text-center text-2xl font-bold mt-8'>Meus pedidos</h2>

        <div className='flex justify-center sm:flex-row flex-col items-center gap-4 py-3'>
          <select
            className='border border-gray-300 rounded-md shadow-sm p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition duration-150 ease-in-out'
            onChange={handleSelectOrder}
            value={selectedOrderId || ''}
          >
            <option value=''>Selecione um pedido</option>
            {receivedOrders.map((pedido, pedidoIndex) => (
              <option key={pedidoIndex} value={pedido.id}>
                Pedido: {pedidoIndex + 1} - {formatarData(pedido.recebidoEm)}
              </option>
            ))}
          </select>

          <Button
            text='Escanear'
            color={`bg-yellow-400 ${
              !selectedOrderId ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            textColor='text-black'
            hover='hover:bg-yellow-300'
            onClick={openModal}
            disabled={!selectedOrderId}
          />
          <Button text='Dev' color='bg-green-400' onClick={testingHandleFunc} />
        </div>

        {receivedOrders.length === 0 ? (
          <p className='text-center'>Nenhum pedido encontrado.</p>
        ) : (
          receivedOrders.map((pedido, pedidoIndex) => (
            <div
              key={pedidoIndex}
              className={`mt-4 border p-4 rounded-md 
              ${selectedOrderId === pedido.id ? 'border-yellow-500' : ''}`}
            >
              <div
                className='flex justify-between items-center cursor-pointer'
                onClick={() => toggleExpandPedido(pedidoIndex)}
              >
                <div className='flex items-center gap-3'>
                  <h3 className='text-lg font-semibold text-gray-800'>
                    Pedido {pedidoIndex + 1}
                  </h3>
                  <span className='text-sm text-gray-500'>
                    {formatarData(pedido.recebidoEm)}
                  </span>
                </div>
                <span>
                  {pedidoExpandido[pedidoIndex] ? (
                    <FaChevronUp className='text-blue-600' />
                  ) : (
                    <FaChevronDown className='text-blue-600' />
                  )}
                </span>
              </div>

              {pedidoExpandido[pedidoIndex] && (
                <ul className='mt-2 space-y-2'>
                  {pedido.produtos.map((produto, produtoIndex) => {
                    const key = `${pedidoIndex}-${produtoIndex}`;
                    return (
                      <li
                        key={key}
                        className='border p-2 rounded-md border-yellow-500'
                      >
                        <div
                          className='flex justify-between items-center cursor-pointer'
                          onClick={() =>
                            toggleExpandProduto(pedidoIndex, produtoIndex)
                          }
                        >
                          <span>
                            <strong>Produto:</strong> {produto.codigo}
                          </span>
                          <span>
                            <strong>Qtd:</strong> {produto.quantidade}
                          </span>
                        </div>

                        {produtoExpandido[key] && (
                          <div className='border p-2 mt-2 rounded-md'>
                            <ul className='list-decimal ml-4 space-y-1 text-wrap'>
                              {Array.from({ length: produto.quantidade }).map(
                                (_, i) => (
                                  <li className='ml-3 text-nowrap' key={i}>
                                    Unidade | {produto.codigo}
                                  </li>
                                ),
                              )}
                            </ul>
                          </div>
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          ))
        )}

        {isModalOpen && (
          <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center'>
            <div className='bg-white p-6 rounded-lg shadow-lg w-full max-w-md'>
              <h2 className='text-lg font-semibold mb-4'>Escaneando...</h2>
              <BarcodeScanner onDetected={handleDetected} />
              <Button text='Fechar' color='bg-red-500' onClick={closeModal} />
            </div>
          </div>
        )}
      </Container>
    </>
  );
};

export default OrdersPage;

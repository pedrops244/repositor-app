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
  const [createOrders, setCreateOrders] = useState([]);
  const [receivedOrders, setReceivedOrders] = useState([]);
  const [pedidoExpandido, setPedidoExpandido] = useState({});
  const [produtoExpandido, setProdutoExpandido] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null); // Pedido Selecionado

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedCreateOrders =
        JSON.parse(localStorage.getItem('createOrders')) || [];
      const storedReceivedOrders =
        JSON.parse(localStorage.getItem('receivedOrders')) || [];
      setCreateOrders(storedCreateOrders);
      setReceivedOrders(storedReceivedOrders);
    }
  }, []);

  const handleSelectOrder = (event) => {
    setSelectedOrderId(event.target.value); // Define o pedido selecionado
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

    const updatedCreateOrders = updateCreateOrders(scannedCode);
    if (!updatedCreateOrders) {
      toast.error('Produto não encontrado no pedido.');
      closeModal();
      return setTimeout(() => window.location.reload(), 2000);
    }

    const newReceivedOrders = updateReceivedOrders(scannedCode);

    saveOrdersToLocalStorage(updatedCreateOrders, newReceivedOrders);
    setCreateOrders(updatedCreateOrders);
    setReceivedOrders(newReceivedOrders);

    toast.success('Produto atualizado com sucesso.');
    closeModal();
    setTimeout(() => window.location.reload(), 2000);
  };

  const updateCreateOrders = (scannedCode) => {
    let foundProduct = false;

    const updatedOrders = createOrders
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

  const updateReceivedOrders = (scannedCode) => {
    const newOrders = [...receivedOrders];
    const existingProductIndex = newOrders.findIndex(
      (produto) => produto.codigo === scannedCode,
    );

    if (existingProductIndex !== -1) {
      newOrders[existingProductIndex].quantidade += 1;
    } else {
      const produtoAdicionado = createOrders
        .flatMap((pedido) => pedido.produtos)
        .find((produto) => produto.codigo === scannedCode);

      if (produtoAdicionado) {
        newOrders.push({ ...produtoAdicionado, quantidade: 1 });
      }
    }
    return newOrders;
  };

  const saveOrdersToLocalStorage = (createOrders, receivedOrders) => {
    saveToLocalStorage('createOrders', createOrders);
    saveToLocalStorage('receivedOrders', receivedOrders);
  };

  return (
    <>
      <NavBar />
      <Container>
        <h2 className='text-center text-2xl font-bold mt-8'>Minhas ordens</h2>

        <div className='flex justify-center sm:flex-row flex-col items-center gap-4 py-3'>
          <select
            className='border p-2 rounded-md text-gray-700'
            onChange={handleSelectOrder}
            value={selectedOrderId || ''}
          >
            <option value='' disabled>
              Selecione um pedido
            </option>
            {createOrders.map((pedido, pedidoIndex) => (
              <option key={pedido.id} value={pedido.id}>
                Pedido: {pedidoIndex + 1} | {formatarData(pedido.enviadoEm)}
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
        </div>

        {createOrders.length === 0 ? (
          <p className='text-center'>Nenhuma ordem encontrada.</p>
        ) : (
          createOrders.map((pedido, pedidoIndex) => (
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
                    {formatarData(pedido.enviadoEm)}
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
                      <li key={key} className='border p-2 rounded-md'>
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

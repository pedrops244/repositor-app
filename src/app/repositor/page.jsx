'use client';
import { useEffect, useState } from 'react';
import Container from '../ui/Container';
import { NavBar } from '../ui/NavBar';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { formatarData } from '../lib/formatarData';
import Button from '../ui/Button';
import BarcodeScanner from '../lib/BarcodeScanner';
import { toast } from 'react-toastify';

const saveToLocalStorage = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};
const OrdersPage = () => {
  const [createOrders, setCreateOrders] = useState([]);
  const [receivedOrders, setReceivedOrders] = useState([]);
  const [pedidoExpandido, setPedidoExpandido] = useState({});
  const [produtoExpandido, setProdutoExpandido] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);

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
    let foundProduct = false;
    let newReceivedOrders = [...receivedOrders];

    const updatedCreateOrders = createOrders
      .map((pedido) => {
        const updatedProdutos = pedido.produtos.filter((produto) => {
          if (produto.codigo === scannedCode && !foundProduct) {
            foundProduct = true;

            if (produto.quantidade > 1) {
              produto.quantidade -= 1;
              return true;
            } else {
              return false;
            }
          }
          return true;
        });

        return { ...pedido, produtos: updatedProdutos };
      })
      .filter((pedido) => pedido.produtos.length > 0);

    if (foundProduct) {
      const existingProductIndex = newReceivedOrders.findIndex(
        (produto) => produto.codigo === scannedCode,
      );

      if (existingProductIndex !== -1) {
        newReceivedOrders[existingProductIndex].quantidade += 1;
      } else {
        const produtoAdicionado = createOrders
          .flatMap((pedido) => pedido.produtos)
          .find((produto) => produto.codigo === scannedCode);

        if (produtoAdicionado) {
          newReceivedOrders.push({ ...produtoAdicionado, quantidade: 1 });
        }
      }

      saveToLocalStorage('createOrders', updatedCreateOrders);
      saveToLocalStorage('receivedOrders', newReceivedOrders);

      setCreateOrders(updatedCreateOrders);
      setReceivedOrders(newReceivedOrders);

      toast.success('Produto atualizado com sucesso.');
    } else {
      toast.error('Produto não encontrado no createOrders.');
    }

    closeModal();
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  return (
    <>
      <NavBar />
      <Container>
        <h2 className='text-center text-2xl font-bold mt-8'>Minhas ordens</h2>
        <div className='flex justify-center gap-4 py-3'>
          <Button
            text='Escanear'
            color='bg-yellow-400'
            textColor='text-black'
            hover='hover:bg-yellow-300'
            onClick={openModal}
          />
        </div>

        {createOrders.length === 0 ? (
          <p className='text-center'>Nenhuma ordem encontrada.</p>
        ) : (
          createOrders.map((pedido, pedidoIndex) => (
            <div key={pedidoIndex} className='mt-4 border p-4 rounded-md'>
              <div
                className='flex justify-between items-center cursor-pointer'
                onClick={() => toggleExpandPedido(pedidoIndex)}
              >
                <div className='flex items-center justify-between p-3 gap-3'>
                  <h3 className='text-lg font-semibold text-gray-800'>
                    Pedido {pedidoIndex + 1}
                  </h3>
                  <span className='text-sm text-gray-500 '>
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
                <ul className='mt-2 space-y-2 '>
                  {pedido.produtos.map((produto, produtoIndex) => {
                    const key = `${pedidoIndex}-${produtoIndex}`;
                    return (
                      <li
                        key={key}
                        className='border-yellow-500 border p-2 rounded-md flex flex-col space-y-2'
                      >
                        <div
                          className='flex justify-between items-center cursor-pointer'
                          onClick={() =>
                            toggleExpandProduto(pedidoIndex, produtoIndex)
                          }
                        >
                          <div className='flex justify-between w-full'>
                            <span>
                              <strong>Produto:</strong> {produto.codigo}
                            </span>
                            <span className='flex gap-1 mr-1'>
                              <strong>Qtd: </strong> {produto.quantidade}
                            </span>
                          </div>
                        </div>

                        {produtoExpandido[key] && (
                          <div className='border p-2 rounded-md mt-2'>
                            <ul className='ml-4 space-y-1  list-decimal'>
                              {Array.from({ length: produto.quantidade }).map(
                                (_, i) => (
                                  <li className='ml-3' key={i}>
                                    {`Unidade | ${produto.codigo}`}
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
              <div className='flex flex-col'>
                <BarcodeScanner onDetected={handleDetected} />
                <Button text='Fechar' color='bg-red-500' onClick={closeModal} />
              </div>
            </div>
          </div>
        )}
      </Container>
    </>
  );
};

export default OrdersPage;

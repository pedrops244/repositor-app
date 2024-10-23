'use client';
import { useEffect, useState } from 'react';
import Container from '../ui/Container';
import { NavBar } from '../ui/NavBar';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { formatarData } from '../lib/formatarData';

const OrdersPage = () => {
  const [receivedOrders, setReceivedOrders] = useState([]);
  const [pedidoExpandido, setPedidoExpandido] = useState({});
  const [produtoExpandido, setProdutoExpandido] = useState({});

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedReceivedOrders =
        JSON.parse(localStorage.getItem('receivedOrders')) || [];
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
    const key = `${pedidoIndex}-${produtoIndex}`; // Chave única para cada produto
    setProdutoExpandido((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <>
      <NavBar />
      <Container>
        <h2 className='text-center text-2xl font-bold mt-8'>Meus Pedidos</h2>

        {receivedOrders.length === 0 ? (
          <p className='text-center'>Nenhum pedido encontrado.</p>
        ) : (
          receivedOrders.map((pedido, pedidoIndex) => (
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
                            <ul className='ml-4 space-y-1  list-decimal text-wrap'>
                              {Array.from({ length: produto.quantidade }).map(
                                (_, i) => (
                                  <li className='ml-3 text-nowrap' key={i}>
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
      </Container>
    </>
  );
};

export default OrdersPage;

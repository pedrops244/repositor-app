'use client';
import { useEffect, useState } from 'react';
import Container from '../ui/Container';
import { NavBar } from '../ui/NavBar';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

const OrdersPage = () => {
  const [pedidos, setPedidos] = useState([]);
  const [pedidoExpandido, setPedidoExpandido] = useState({});
  const [produtoExpandido, setProdutoExpandido] = useState({});

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedPedidos = JSON.parse(localStorage.getItem('pedidos')) || [];
      setPedidos(storedPedidos);
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
        <h2 className='text-center text-3xl font-bold mt-8'>Meus Pedidos</h2>

        {pedidos.length === 0 ? (
          <p className='text-center'>Nenhum pedido encontrado.</p>
        ) : (
          pedidos.map((pedido, pedidoIndex) => (
            <div key={pedidoIndex} className='mt-4 border p-4 rounded-md'>
              <div
                className='flex justify-between items-center cursor-pointer'
                onClick={() => toggleExpandPedido(pedidoIndex)}
              >
                <h3 className='text-lg font-semibold'>
                  Pedido {pedidoIndex + 1}
                </h3>
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
                  {pedido.map((produto, produtoIndex) => {
                    const key = `${pedidoIndex}-${produtoIndex}`; // Chave única
                    return (
                      <li
                        key={key}
                        className='border p-2 rounded-md flex flex-col space-y-2'
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
                            <span className='mr-2 '>
                              <strong>Quantidade:</strong> {produto.quantidade}
                            </span>
                          </div>
                          <span>
                            {produtoExpandido[key] ? (
                              <FaChevronUp className='text-blue-600' />
                            ) : (
                              <FaChevronDown className='text-blue-600' />
                            )}
                          </span>
                        </div>

                        {produtoExpandido[key] && (
                          <div className='ml-3 space-y-1'>
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

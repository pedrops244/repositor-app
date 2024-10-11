'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Container from '../ui/Container';
import { NavBar } from '../ui/NavBar';

const OrdersPage = () => {
  const [pedidos, setPedidos] = useState([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedPedidos = JSON.parse(localStorage.getItem('pedidos')) || [];
      setPedidos(storedPedidos);
    }
  }, []);

  return (
    <>
      <NavBar />
      <Container>
        <h2 className='text-center text-xl font-bold mt-8'>Meus Pedidos</h2>
        {pedidos.length === 0 ? (
          <p className='text-center'>Nenhum pedido encontrado.</p>
        ) : (
          pedidos.map((pedido, index) => (
            <div key={index} className='mt-4 border p-4 rounded-md'>
              <h3 className='text-lg font-semibold'>Pedido {index + 1}</h3>
              <ul className='mt-2'>
                {pedido.map((produto, produtoIndex) => (
                  <li key={produtoIndex} className='flex justify-between'>
                    <span>Código: {produto.codigo}</span>
                    <span>Quantidade: {produto.quantidade}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))
        )}
      </Container>
    </>
  );
};

export default OrdersPage;

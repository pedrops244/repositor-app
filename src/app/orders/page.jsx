'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

const OrdersPage = () => {
  const [pedidos, setPedidos] = useState([]);

  useEffect(() => {
    const savedPedidos = JSON.parse(localStorage.getItem('pedidos')) || [];
    setPedidos(savedPedidos);
  }, []);

  useEffect(() => {
    localStorage.setItem('pedidos', JSON.stringify(pedidos));
  }, [pedidos]);

  console.log(pedidos);

  return (
    <div className='flex flex-col items-center justify-center min-h-screen'></div>
  );
};

export default OrdersPage;

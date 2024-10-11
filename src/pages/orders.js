// src/pages/orders.js
import { useEffect, useState } from 'react';
import Orders from '../components/Orders';

const OrdersPage = () => {
  const [pedidos, setPedidos] = useState([]);

  useEffect(() => {
    // Aqui você pode carregar os pedidos de um local externo ou de um state global, se necessário.
    // Por enquanto, vamos manter isso em memória apenas para exemplificar.
    const savedPedidos = JSON.parse(localStorage.getItem('pedidos')) || [];
    setPedidos(savedPedidos);
  }, []);

  useEffect(() => {
    // Salvar os pedidos no localStorage sempre que a lista de pedidos mudar
    localStorage.setItem('pedidos', JSON.stringify(pedidos));
  }, [pedidos]);

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gray-100'>
      <Orders pedidos={pedidos} />
    </div>
  );
};

export default OrdersPage;

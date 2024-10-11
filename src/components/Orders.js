// src/components/Orders.js
const Orders = ({ pedidos }) => {
  return (
    <div className='mt-6 p-4 border rounded-lg shadow-md'>
      <h2 className='text-2xl font-bold text-[#0800ff]'>Meus Pedidos</h2>
      <div id='ordersList' className='w-full max-w-md'>
        {pedidos.length === 0 ? (
          <p>Nenhum pedido feito ainda.</p>
        ) : (
          pedidos.map((pedido, index) => (
            <div
              key={index}
              className='border p-4 mb-2 bg-white shadow-md rounded'
            >
              <h3 className='font-semibold'>Pedido {index + 1}</h3>
              {pedido.map((produto, idx) => (
                <div key={idx}>
                  Produto: {produto.codigo}, Quantidade: {produto.quantidade}
                </div>
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Orders;

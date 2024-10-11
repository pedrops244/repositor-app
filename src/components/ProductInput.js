// src/components/ProductInput.js
import { useState } from 'react';

const ProductInput = ({ addProduct }) => {
  const [codigo, setCodigo] = useState('');
  const [quantidade, setQuantidade] = useState('');

  const handleAddProduct = () => {
    if (codigo && quantidade > 0) {
      addProduct(codigo, quantidade);
      setCodigo('');
      setQuantidade('');
    } else {
      alert('Por favor, insira um código e uma quantidade válida.');
    }
  };

  return (
    <div className='mb-4'>
      <input
        type='text'
        value={codigo}
        onChange={(e) => setCodigo(e.target.value)}
        placeholder='Código lido'
        className='border border-gray-300 p-2 rounded'
      />
      <input
        type='number'
        value={quantidade}
        onChange={(e) => setQuantidade(e.target.value)}
        placeholder='Quantidade'
        className='border border-gray-300 p-2 rounded ml-2'
      />
      <button onClick={handleAddProduct} className='btn ml-2'>
        Adicionar Produto
      </button>
    </div>
  );
};

export default ProductInput;

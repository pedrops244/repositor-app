// src/components/ProductList.js
const ProductList = ({ produtos }) => {
  return (
    <div id='produtos' className='w-full max-w-md'>
      {produtos.map((produto, index) => (
        <div key={index} className='border p-4 mb-2 bg-white shadow-md rounded'>
          Produto: {produto.codigo} - Quantidade: {produto.quantidade}
        </div>
      ))}
    </div>
  );
};

export default ProductList;

const Input = ({ type, value, onChange, placeholder, disabled }) => {
  return (
    <input
      type={type || 'text'}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className='bg-gray-800 text-gray-400 py-2 px-4 rounded-md border-none focus:outline-none'
      disabled={disabled}
    />
  );
};

export default Input;

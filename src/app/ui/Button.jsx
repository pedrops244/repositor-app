const Button = ({ text, onClick, color, textColor, hover }) => {
  return (
    <button
      className={`py-2 px-4 rounded-md text-base font-medium ${
        textColor || 'text-white'
      } ${color} ${hover || 'hover:opacity-90'}`}
      onClick={onClick}
    >
      {text}
    </button>
  );
};

export default Button;

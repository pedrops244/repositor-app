const Container = ({ children }) => {
  return (
    <div className='w-full max-w-screen-md mx-auto px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-16'>
      {children}
    </div>
  );
};

export default Container;

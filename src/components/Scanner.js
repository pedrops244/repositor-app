// src/components/Scanner.js
import { useEffect, useRef, useState } from 'react';
import { BrowserMultiFormatReader } from '@zxing/library';

const Scanner = () => {
  const videoRef = useRef(null);
  const [decodedText, setDecodedText] = useState('');
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    const codeReader = new BrowserMultiFormatReader();

    const startScanning = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
        });
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute('playsinline', true);
        videoRef.current.play();

        codeReader.decodeFromVideoDevice(
          null, // Passando `null` para usar a câmera padrão
          videoRef.current,
          (result, err) => {
            if (result) {
              setDecodedText(result.getText());
            }
            if (err && !(err instanceof ZXing.NotFoundException)) {
              console.error(err);
            }
          },
        );
      } catch (err) {
        console.error('Erro ao iniciar a câmera:', err);
      }
    };

    if (isScanning) {
      startScanning();
    }

    // Limpeza na desmontagem do componente
    return () => {
      codeReader.reset();
      // Verifica se videoRef.current existe
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isScanning]);

  return (
    <div className='flex flex-col items-center p-4'>
      <video
        ref={videoRef}
        className='border border-gray-300 mb-4 w-full h-auto'
      />
      {decodedText && (
        <p className='mt-2 text-lg text-[#0800ff]'>
          Código Escaneado: {decodedText}
        </p>
      )}
      <button
        onClick={() => setIsScanning((prev) => !prev)}
        className='mt-4 p-2 bg-[#0800ff] text-white rounded hover:bg-[#037ac5] transition duration-300 ease-in-out'
      >
        {isScanning ? 'Parar Escaneamento' : 'Iniciar Escaneamento'}
      </button>
    </div>
  );
};

export default Scanner;

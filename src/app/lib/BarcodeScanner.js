'use client';
import { useEffect, useRef, useState } from 'react'; // Importações únicas
import Quagga from '@ericblade/quagga2';
import { toast } from 'react-toastify';

const BarcodeScanner = ({ onDetected }) => {
  const scannerRef = useRef(null);
  const [isMounted, setIsMounted] = useState(false);
  let lastScannedCode = null;
  let debounceTimeout = null;

  useEffect(() => {
    setIsMounted(true);
    return () => {
      setIsMounted(false);
    };
  }, []);

  useEffect(() => {
    if (!isMounted || !scannerRef.current) return;

    Quagga.init(
      {
        inputStream: {
          name: 'Live',
          type: 'LiveStream',
          target: scannerRef.current,
          constraints: {
            facingMode: 'environment',
            width: 640,
            height: 480,
          },
        },
        decoder: {
          readers: ['ean_reader'],
          multiple: false,
        },
        locator: {
          halfSample: true,
          patchSize: 'medium',
          debug: false,
        },
        numOfWorkers: navigator.hardwareConcurrency || 4,
        frequency: 5,
        locate: true,
      },
      (err) => {
        if (err) {
          console.error('Erro ao iniciar o scanner:', err);
          toast.error('Erro ao iniciar o scanner. Tente novamente.');
          return;
        }
        Quagga.start();
      },
    );

    Quagga.onDetected((result) => {
      const scannedCode = result.codeResult?.code;
      if (!scannedCode || scannedCode === lastScannedCode) return;

      lastScannedCode = scannedCode;

      clearTimeout(debounceTimeout);
      debounceTimeout = setTimeout(() => {
        lastScannedCode = null;
      }, 1000);

      onDetected(scannedCode);
    });

    return () => {
      Quagga.stop();
      Quagga.offDetected();
    };
  }, [isMounted, onDetected]);

  return <div ref={scannerRef} className='sm:max-h-80 max-h-64' />;
};

export default BarcodeScanner;

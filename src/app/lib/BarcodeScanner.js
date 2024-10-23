'use client';
import { useEffect } from 'react';
import Quagga from '@ericblade/quagga2';
import { toast } from 'react-toastify';

const BarcodeScanner = ({ onDetected, onClose }) => {
  let lastScannedCode = null;
  let debounceTimeout = null;

  useEffect(() => {
    Quagga.init(
      {
        inputStream: {
          type: 'LiveStream',
          target: document.querySelector('#scanner'),
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
    };
  }, [onDetected]);

  return <div id='scanner' className='sm:max-h-80 max-h-64' />;
};

export default BarcodeScanner;

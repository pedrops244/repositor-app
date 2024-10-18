'use client';
import { useEffect } from 'react';
import Quagga from '@ericblade/quagga2';
import { toast } from 'react-toastify';

const BarcodeScanner = ({ onDetected, onClose }) => {
  useEffect(() => {
    Quagga.init(
      {
        inputStream: {
          type: 'LiveStream',
          target: document.querySelector('#scanner'),
        },
        decoder: {
          readers: ['code_128_reader', 'ean_reader'],
        },
      },
      (err) => {
        if (err) {
          return;
        }
        Quagga.start();
      },
    );

    Quagga.onDetected((result) => {
      if (result?.codeResult?.code) {
        const scannedCode = result.codeResult.code;
        onDetected(scannedCode);
      }
    });

    return () => Quagga.stop();
  }, [onDetected]);

  return <div id='scanner' className='sm:max-h-80 max-h-64' />;
};

export default BarcodeScanner;

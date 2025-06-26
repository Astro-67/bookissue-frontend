import React, { useEffect, useState } from 'react';
import { RiCheckLine, RiInformationLine, RiCloseLine } from 'react-icons/ri';

interface ToastProps {
  message: string;
  type?: 'success' | 'info';
  duration?: number;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ 
  message, 
  type = 'info', 
  duration = 3000, 
  onClose 
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Wait for fade out animation
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  const getToastStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-green-500 text-white';
      case 'info':
      default:
        return 'bg-blue-500 text-white';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <RiCheckLine className="w-5 h-5" />;
      case 'info':
      default:
        return <RiInformationLine className="w-5 h-5" />;
    }
  };

  return (
    <div
      className={`fixed top-4 right-4 max-w-sm w-full shadow-lg rounded-lg pointer-events-auto transition-all duration-300 z-50 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
      }`}
    >
      <div className={`rounded-lg p-4 ${getToastStyles()}`}>
        <div className="flex items-center">
          <div className="flex-shrink-0">
            {getIcon()}
          </div>
          <div className="ml-3 flex-1">
            <p className="text-sm font-medium">{message}</p>
          </div>
          <div className="ml-4 flex-shrink-0">
            <button
              onClick={handleClose}
              className="inline-flex text-white hover:text-gray-200 focus:outline-none focus:text-gray-200 transition ease-in-out duration-150"
            >
              <RiCloseLine className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Toast;

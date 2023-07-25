import React, { FC } from "react";
import { IoCloseSharp } from "react-icons/io5";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center w-screen h-screen bg-opacity-50 bg-gray-900">
      <div className="relative z-50 p-6 bg-white rounded-md shadow-lg w-96">
        {children}
        <button
          className="absolute top-0 right-0 mt-4 mr-4 text-xl "
          onClick={onClose}
        >
          <IoCloseSharp />
        </button>
      </div>
    </div>
  );
};

export default Modal;

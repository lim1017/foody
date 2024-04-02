import React, { useState } from "react";
import { Dialog } from "@headlessui/react";

export const useModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleModal = () => setIsOpen(!isOpen);
  return {
    isOpen,
    toggleModal,
    setIsOpen,
  };
};

interface ModalProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  children: React.ReactNode;
}

const Modal = ({ isOpen, setIsOpen, children }: ModalProps) => {
  return (
    <Dialog
      open={isOpen}
      onClose={() => setIsOpen(false)}
      className="relative z-50"
    >
      {/* The backdrop, rendered as a fixed sibling to the panel container */}
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      {/* Full-screen scrollable container */}
      <div className="fixed inset-0 w-screen overflow-y-auto">
        {/* Container to center the panel */}
        <div className="flex min-h-full items-center justify-center p-4">
          {/* The actual dialog panel  */}
          <Dialog.Panel className="mx-auto max-w-sm rounded bg-white absolute top-20 inset-x-0 h-4/5 overflow-y-auto">
            <Dialog.Description>{children}</Dialog.Description>
          </Dialog.Panel>
        </div>
      </div>
    </Dialog>
  );
};

export default Modal;

import * as React from 'react';
import { useIsAdBlocker } from '../.';
import './Modal.module.css';

const Modal = () => {
  const [showModal, storageSetter] = useIsAdBlocker({storageType: 'session'});
  const [isOpen, setIsOpen] = React.useState<boolean>(true);

  const handleClose = () => {
    storageSetter();
    setIsOpen(false);
  };

  return showModal && isOpen ? (
    <div className="modal">
      <div className="modalMain">
        <h1>PLEASE UNBLOCK ME !!!</h1>
        <button type="button" onClick={handleClose}>
          CLOSE ME
        </button>
      </div>
    </div>
  ) : null;
};

export default Modal;

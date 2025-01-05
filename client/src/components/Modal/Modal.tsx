import React, { useState, useEffect } from 'react';

interface ModalProps {
  clickedTD: string;
  showModal: boolean;
  closeModal: () => void;
}

const Modal: React.FC<ModalProps> = (props) => {    

    return (
        <div>
            {props.showModal && (<div onClick={props.closeModal}>
            {props.clickedTD};
        </div>)}
        </div>
 
    )
}

export default Modal;
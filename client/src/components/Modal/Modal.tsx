import React, { useState, useEffect } from 'react';

interface ModalProps {
  clickedTD: string;
}

const Modal: React.FC<ModalProps> = (props) => {
    const [showModal, setShowModal] = useState<boolean>(false);
    
    useEffect(() => {
        if (props.clickedTD !== "") {
            setShowModal(true);
        }
    }, [props.clickedTD]) 

    useEffect(() => {
        if (showModal) {
            document.body.classList.add('active-modal');
          } else {
            document.body.classList.remove('active-modal');
          }
          // Cleanup function to remove the class when the component unmounts or modal is closed
          return () => {
            document.body.classList.remove('active-modal');
          };
    }, [showModal]);

    const closeModal = () => {
        setShowModal(false);
    }

    return (
        <div>
            {showModal && (<div onClick={closeModal}>
            {props.clickedTD};
        </div>)}
        </div>
 
    )
}

export default Modal;
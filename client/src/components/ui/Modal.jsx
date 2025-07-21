import React from 'react'
import { createPortal } from "react-dom";
import { motion } from 'motion/react'

const Modal = ({ isOpen, children, modalContentClass }) => {
  
  if (!isOpen) return null;
  
  return createPortal(
    <ModalContent children={children} modalContentClass={modalContentClass} />,
    document.getElementById('portal')
  )

}

const ModalContent = ({ children, modalContentClass }) => {
  return (
    <motion.div 
      className='modal-backdrop'
      initial = {{opacity: 0, backdropFilter: "blur(0)"}}
      animate = {{opacity: 1, backdropFilter: "blur(4px)"}}
      exit={{opacity: 0, backdropFilter: "blur(0)"}}
      transition={{ duration: 0.3 }}
      >
      <motion.div className={`modal-content items-center ${modalContentClass}`}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -30 }}
        transition={{ duration: 0.3 }}
        >

          { children }
        
      </motion.div>
    </motion.div>
  )
}

export default Modal
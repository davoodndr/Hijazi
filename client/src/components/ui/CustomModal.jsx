import React from 'react'
import { createPortal } from "react-dom";
import { motion } from 'motion/react'

const Modal = ({ isOpen, className='', popupClass = '', children, ...other }) => {
  
  if (!isOpen) return null;
  
  /* return createPortal(
    <ModalContent children={children} className={className} />,
    document.getElementById('portal')
  ) */

  return <ModalContent children={children} className={className} popupClass={popupClass} other={other} />
}

const ModalContent = ({ className = '', popupClass = '', children, ...other }) => {
  return (
    <motion.div 
      className={`${className}`}
      initial = {{opacity: 0, backdropFilter: "blur(0)"}}
      animate = {{opacity: 1, backdropFilter: "blur(4px)"}}
      exit={{opacity: 0, backdropFilter: "blur(0)"}}
      transition={{ duration: 0.3 }}
      >
      <motion.div className={`${popupClass}`}
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
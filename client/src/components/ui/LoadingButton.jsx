import { AnimatePresence, motion } from 'motion/react'
import React from 'react'

function LoadingButton({
  text, className, form, buttonType, icon, onClick, loading, loadingText
}) {

  return (
    <button
      onClick={onClick}
      type={buttonType}
      form={form}
      className={`${loading && 'pointer-events-none'} ${className}`}>

      <span className={`transition-all duration-300 ${loading ? 'me-2' : ''}`}>
        {loading ? loadingText : text}
      </span>
      <AnimatePresence mode="wait">
        {loading && (
          <motion.div
            key="spinner"
            initial={{ width: 0, height: 0, opacity: 0 }}
            animate={{ width: icon.props.size, height: icon.props.size, opacity: 1 }}
            exit={{ width: 0, height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="flex items-center justify-center"
          >
          {icon}
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  )
}

export default LoadingButton
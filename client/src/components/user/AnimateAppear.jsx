import React, { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'motion/react'
import { useScrollDirection } from '../../hooks/useScrollDirection';

function AnimateComponent({children, className=''}) {

  const ref = useRef(null);
  const isInView = useInView(ref, { threshold: 0.2 });
  const scrollDir = useScrollDirection();

  return (
    <motion.section 
      ref={ref} 
      initial={scrollDir === 'down' ? {opacity: 0, y:-200} : {opacity: 0, y:200}}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{duration: 0.6, ease: 'easeOut'}}
      className={className}
    >

    {children}

    </motion.section>
  )
}

const AnimateAppear = React.memo(AnimateComponent)

export default AnimateAppear
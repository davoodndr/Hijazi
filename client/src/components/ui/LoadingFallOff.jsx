import React from 'react'
import { CircleLoader } from 'react-spinners';
import { hexToRgba } from '../../utils/Utils';

const LoadingFallOff = ({loading, height = 100, bg = '#ffffff', iconColor= 'var(--color-primary-400)'}) => {

  return (
    <section 
      className={`loader w-full flex items-center justify-center backdrop-blur-none 
        fixed top-0 left-0 right-0 bottom-0 z-[10000] ${loading && 'display backdrop-blur-xs'}`}
      style={{height: `${height}vh`, backgroundColor: hexToRgba(bg, 50)}}
    >
      <div>
        <CircleLoader color={iconColor} />
        <div>Loading...</div>
      </div>
    </section>
  )
}

export default LoadingFallOff
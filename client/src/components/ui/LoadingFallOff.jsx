import React from 'react'
import { CircleLoader } from 'react-spinners';

const LoadingFallOff = ({height = 100}) => {
  return (
    <main 
      className={`w-full flex items-center justify-center`}
      style={{height: `${height}vh`}}
    >
      <div>
        <CircleLoader color='var(--color-primary-400)' />
        <div>Loading...</div>
      </div>
    </main>
  )
}

export default LoadingFallOff
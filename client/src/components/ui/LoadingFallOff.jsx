import React from 'react'
import { CircleLoader } from 'react-spinners';

const LoadingFallOff = ({height = 100}) => {
  return (
    <main className={`w-full h-[${height}vh] flex items-center justify-center`}>
      <div>
        <CircleLoader color='var(--color-primary-400)' />
        <div>Loading...</div>
      </div>
    </main>
  )
}

export default LoadingFallOff
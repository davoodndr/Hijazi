import React from 'react'
import Skeleton from './Skeleton'

function SkeltoListComponent() {
  return (
    <>
      <div className="rounded px-6 py-4 space-y-3">
        <Skeleton height="h-10" width="w-full" />
      </div>
      <div className="rounded px-6 py-4 space-y-3">
        <Skeleton height="h-10" width="w-full" />
      </div>
      <div className="rounded px-6 py-4 space-y-3">
        <Skeleton height="h-10" width="w-full" />
      </div>
    </>
  )
}

const SkeltoList = React.memo(SkeltoListComponent)

export default SkeltoList
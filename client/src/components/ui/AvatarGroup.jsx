import React from 'react'

function AvatarGroup({images, className, avatarClass}) {
  return (
    <div className={`flex ${className}`}>
      {images?.map((img, ind) => 
        <div key={ind} className={`${avatarClass}`}
          style={{zIndex: 30 - ind}}
        >
          <img src={img.image} alt={img.name} />
        </div>
      )}
    </div>
  )
}

export default AvatarGroup
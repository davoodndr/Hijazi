import React from 'react'
import { useNavigate } from 'react-router'

function PageTitleComponent({
  title,
  subTitle,
  listType,
  showStrength = false,
  strength,
  actions,
  onAction
}) {

  const navigate = useNavigate();

  const handleAction = (action)=>{
    
    if(action.type === 'route'){
      navigate(action?.route)
    }else if(action?.type === 'modal'){
      onAction(action?.action);
    }
  }

  return (
    <div className="mb-5 flex justify-between items-start">
      <div className="inline-flex flex-col">
        <div className="flex items-center leading-4 space-x-3">
          <h3 className='text-xl'>{title}</h3>
          {showStrength && (
            <>
              <span className='border-r border-gray-400/70 inline-flex h-5'></span>
              <p className='space-x-1 text-black'>
                <span className='font-semibold'>{strength}</span>
                <span className='text-xs text-gray-500 capitalize'>{listType}</span>
              </p>
            </>
          )}
        </div>
        <span className='sub-title'>{subTitle}</span>
      </div>
      {actions?.length > 0 &&
        actions?.map(action => 
          <button
            key={action?.label}
            onClick={() => handleAction(action)}
            className='px-4! inline-flex items-center gap-2 text-white'
          >
            {action?.icon}
            <span>{action?.label}</span>
          </button>
        )
      }
    </div>
  )

}

export default PageTitleComponent
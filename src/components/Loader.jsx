import React from 'react'

const Loader = () => {
  return (
    <div className='flex justify-center items-center py-3 '>
      <div className='animate-spin rounded-full border-4 h-32 w-32 border-b-2 border-[#2952e3] '/>
    </div>
  )
}

export default Loader

import React from 'react'

function Hotel({trip}) {
  return (
    <div>
         <h2 className='font-bold text-xl mt-5'>Hotel Recommendations</h2>
        <div className="grid grid-cols-2 my-5 md:grid-cols-2 xl:grid-cols-4 gap-5">
          {trip?.tripData?.hotelOptions?.map((item,index)=>(
            <div>
              <img src='/placeholder.jpg' className='rounded-xl'/>
            </div>

          ))}
          
        </div>
        <h3>hello</h3>
    </div>
  )
}

export default Hotel
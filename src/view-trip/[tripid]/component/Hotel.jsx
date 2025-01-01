import React from 'react'

function Hotel({trip}) {
  return (
    <div>
         <h2 className='font-bold text-xl mt-5'>Hotel Recommendations</h2>
        <div className="grid grid-cols-2 my-5 md:grid-cols-2 xl:grid-cols-4 gap-5">
          {trip?.tripData?.hotelOptions?.map((item,index)=>(
            <div>
              <img src='/placeholder.jpg' className='rounded-xl'/>
              <div class="my-2 flex flex-col gap-2">
                <h2 class="font-medium">{item.hotelName}</h2>
                <h2 class="text-xs text-gray-500">📍{item.hotelAddress}</h2>
                <h2 class="text-sm">💰 {item.price}</h2>
                <h2 class="text-sm">⭐{item.rating}</h2>
              </div>
            </div>

          ))}
          
        </div>
        
    </div>
  )
}

export default Hotel
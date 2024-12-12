import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { toast } from 'sonner';
import { db } from '@/service/firebaseConfig';
import { doc ,getDoc} from 'firebase/firestore';
import InfoSection from './component/InfoSection';
import Hotel from './component/Hotel';

function Viewtrip() {

  const {tripid}=useParams();
  useEffect(()=>{
    tripid&&getTripData()

  },[tripid])
  const[trip,setTrip]=useState([]);

  const getTripData=async()=>{
    const docRef=doc(db,'AiTrips',tripid);
    const docSnap=await getDoc(docRef);
    if(docSnap.exists()){
      console.log("document:",docSnap.data())
      setTrip(docSnap.data())
    }
    else{
      console.log("No such document!");
      toast('NO Trip Found')
    }
  }
  return (
    <div className='p-10 md:px-20 lg:px-44 xl:px-56'>
      <InfoSection trip={trip}/>
      <Hotel trip={trip}/>
    </div>
  )
}

export default Viewtrip
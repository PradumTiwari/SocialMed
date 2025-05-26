import { getUsersToMessage } from '@/actions/messages.action';
import ShowUsertoMssg from '@/components/ShowUsertoMssg';
import React from 'react'

const ShowUsersToMessage = async() => {
    const users=await getUsersToMessage();
    console.log("USerts Pradum",users);
    
    return <ShowUsertoMssg  />
  
}

export default ShowUsersToMessage
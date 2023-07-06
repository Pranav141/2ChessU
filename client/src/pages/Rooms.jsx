import React from 'react'
import { useParams } from 'react-router-dom'
import Clipboard from '../components/Clipboard'
import Chats from '../components/Chats'
import ChessBoard from '../components/ChessBoard'

const Rooms = ({socket}) => {
  let {roomID}=useParams() 
  return (
    <div className='lg:flex m-4'>
        <div className='lg:w-3/6  flex '>
            <ChessBoard className='justify-center items-center' socket={socket} room={roomID}/>
        
        </div>
        
        <div className='lg:w-2/5 '>

        <Clipboard roomID={roomID}/>
        <Chats socket={socket} room={roomID}/>
        </div>
    </div>
  )
}

export default Rooms
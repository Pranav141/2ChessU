import React,{useState} from 'react'
import { useEffect } from 'react';
import { useUserData } from '../context/usercontext';
import ScrollToBottom from 'react-scroll-to-bottom';

const Chats = ({socket,room}) => {
    const data=useUserData();
    const state=data.state;
    const [messageList,setMessageList]=useState([{
        type:"game_joined",
        room:room,
        username:state.username,
        time:new Date(Date.now()).getHours()+":"+new Date(Date.now()).getMinutes()
    }]);
    
    const [currentMessage,setCurrentMessage]=useState("")
    useEffect(()=>{
        socket.on("game_joined",(data)=>{
            setMessageList((m)=>[...m,data]);
        })
        socket.on("receive_message",(data)=>{
            setMessageList((m)=>[...m,data]);
        })
    },[socket])
    const sendMessage=()=>{
        if(currentMessage===""){
            return
        }
        const data={
            type:"message",
            username:state.username,
            message:currentMessage,
            room:room,
            time:new Date(Date.now()).getHours()+":"+new Date(Date.now()).getMinutes()
        }
        socket.emit("send_message",data);
        const temp={
            type:"my_msg",
            username:state.username,
            message:currentMessage,
            room:room,
            time:new Date(Date.now()).getHours()+":"+new Date(Date.now()).getMinutes()
        }
        setMessageList((m)=>[...m,temp])
        setCurrentMessage("")
    }
    console.log(messageList);
  return (
    <div className=' border-2 rounded-lg rounded-b-2xl h-2/3'>
        <div className='border-b-2 p-2'>
            Live chat ({state.username})
        </div>
     <div className='h-full'>

        <div className='h-4/5'>
     <ScrollToBottom mode='bottom'  className='h-full w-full overflow-x-hidden'>
            {messageList?.map((message)=>{
                if(message.type==="game_joined"){
                    return(
                        <div>
                        <p>
                            {message.username} has joined the game. ({message.time})
                        </p>
                        </div>
                    )
                }
                
                return(
                    <p>{message.username}:- {message.message} ({message.time})</p>
                    )
                })}
    </ScrollToBottom>
        </div>
            <div className='flex justify-between h-8'>
                <input type="text" value={currentMessage} onChange={e=>setCurrentMessage(e.target.value)} onKeyPress={(event) => {
            event.key === "Enter" && sendMessage();
          }} className='border-gray-300  border-2 w-4/5 p-2 rounded-2xl'/>
                <button className='w-1/5 rounded-2xl bg-orange-300 hover:shadow-orange-200 hover:shadow-md'  onClick={sendMessage}>Send</button>
            </div>
        </div>
    </div>
  )
}

export default Chats